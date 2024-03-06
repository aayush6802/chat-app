export const saveImageToCloudinary = async (pics) => {
  const data = new FormData();
  data.append("file", pics);
  data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
  try {
    const res = await fetch(import.meta.env.VITE_CLOUDINARY_API_URL, {
      method: "POST",
      body: data,
    });
    const cloudData = await res.json();
    const picUrl = await cloudData.url.toString();
    // console.log(typeof picUrl);
    return picUrl;
  } catch (error) {
    console.log(error);
    return error;
  }
};
