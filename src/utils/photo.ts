import { Plugins } from "@capacitor/core";

export async function getPhotoAsBlob(path: string): Promise<Blob> {
    const { data } = await Plugins.Filesystem.readFile({ path });
    return getBase64PhotoAsBlob("data:image/jpg;base64," + data);
}

export async function getBase64PhotoAsBlob(photo: string): Promise<Blob> {
    return fetch(photo).then((result) => result.blob());
}
