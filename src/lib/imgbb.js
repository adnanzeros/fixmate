
export async function uploadImage(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error('ImgBB key is missing (NEXT_PUBLIC_IMGBB_KEY)');
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image must be under 5 MB');

  const body = new FormData();
  body.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: 'POST',
    body,
  });
  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json?.data?.url) {
    throw new Error(json?.error?.message || 'Image upload failed');
  }
  return json.data.url;
}
