
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firebase } from './firebaseConfig';

export const uploadFileHandler = async (type: any, file: any) => {
    return new Promise(function (resolve, reject) {
        const storage = getStorage(firebase);
        const fileName = Date.now() + "_" + file.name;
        const storageRef = ref(storage, type + '/' + fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => { },
            (error) => {
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                });
            }
        );
    })
}