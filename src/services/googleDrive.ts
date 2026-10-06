export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  modifiedTime?: string;
}

export async function searchDriveSheets(
  token: string,
  searchQuery?: string
): Promise<DriveFile[]> {
  let q = "mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false";
  if (searchQuery) {
    const escaped = searchQuery.replace(/'/g, "\\'");
    q += ` and name contains '${escaped}'`;
  }

  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    q
  )}&fields=files(id,name,mimeType,webViewLink,modifiedTime)&orderBy=modifiedTime desc&pageSize=15`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to list Google Drive files: ${err}`);
  }

  const data = await res.json();
  return data.files || [];
}

export async function createWineInventorySpreadsheet(
  token: string,
  title: string,
  rows: (string | number)[][]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  // 1. Create spreadsheet with title
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: 'Inventory Counts',
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create Google Spreadsheet: ${err}`);
  }

  const createData = await createRes.json();
  const spreadsheetId = createData.spreadsheetId;
  const spreadsheetUrl = createData.spreadsheetUrl;

  // 2. Append rows to the spreadsheet
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Inventory Counts!A1:append?valueInputOption=USER_ENTERED`;
  const appendRes = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: rows,
    }),
  });

  if (!appendRes.ok) {
    const err = await appendRes.text();
    throw new Error(`Failed to populate spreadsheet data: ${err}`);
  }

  return { spreadsheetId, spreadsheetUrl };
}
