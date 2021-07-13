const S3 = require("aws-sdk/clients/s3")
const fs = require("fs-extra");

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const secretAccessKey = process.env.AWS_SECRET_KEY
const accessKeyId = process.env.AWS_ACCESS_KEY

const s3 = new S3({
   region,accessKeyId,secretAccessKey
})

//uploads file to s3
function uploadFile(file,name){
    console.log(name)
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: name.toString()
    }

    return s3.upload(uploadParams).promise()
}

exports.uploadFile = uploadFile

//downloads a file from s3
function getFileStream(fileKey){
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream
}