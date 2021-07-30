import { Plugins, CameraResultType, CameraPhoto, CameraSource } from "@capacitor/core";
import { PhotoReference } from "../types/photo";

export function usePhotoCapture(onSuccess: (photo: PhotoReference) => void, onFailure: () => void) {
    function onCameraSuccess(photo: CameraPhoto) {
        const { path, webPath } = photo;
        if (path && webPath) {
            onSuccess({ path, webPath });
        }
    }

    function onCameraError({ message }: { message: string }) {
        switch (message) {
            case "User cancelled photos app":
            case "No image picked":
                break;
            default:
                onFailure();
        }
    }

    function choosePhoto() {
        Plugins.Camera.getPhoto({
            source: CameraSource.Photos,
            resultType: CameraResultType.Uri,
            quality: 75,
            webUseInput: true,
        }).then(onCameraSuccess, onCameraError);
    }

    function capturePhoto() {
        Plugins.Camera.getPhoto({
            source: CameraSource.Camera,
            resultType: CameraResultType.Uri,
            quality: 75,
            webUseInput: true,
        }).then(onCameraSuccess, onCameraError);
    }

    return { choosePhoto, capturePhoto };
}
