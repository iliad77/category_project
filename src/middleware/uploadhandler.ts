import multer from "multer";
import path from "path";

const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, "../../uploads"),
    filename(request, file, callback) {
        const unique_name =
            Date.now() + "_" + path.parse(file.originalname).name;
        const ext = path.extname(file.originalname);
        callback(null, unique_name + ext);
    },
});

const upload = multer({
    storage: diskstorage,
    limits: { fieldSize: 10000 },
    fileFilter(request, file, callback) {
        const filetype: Array<String> = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
        ];
        if (filetype.includes(file.mimetype)) callback(null, true);
        else callback(new Error("file is not an image!"));
    },
});

export default upload;
