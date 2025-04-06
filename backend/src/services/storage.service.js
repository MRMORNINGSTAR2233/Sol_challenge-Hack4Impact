const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { Readable } = require('stream');

class StorageService {
  constructor() {
    this.bucket = null;
    
    // Only initialize after the mongoose connection is established
    mongoose.connection.once('open', () => {
      this.initializeBucket();
    });
    
    console.log('Storage service initialized');
  }

  async initializeBucket() {
    try {
      // Check if the connection is ready
      if (mongoose.connection.readyState !== 1) {
        console.log('Waiting for MongoDB connection before initializing GridFS bucket');
        return;
      }
      
      // Create the bucket using the established connection
      this.bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'assignments'
      });
      console.log('GridFS bucket initialized successfully');
    } catch (error) {
      console.error('Error initializing GridFS bucket:', error);
    }
  }

  async ensureBucket() {
    if (!this.bucket) {
      // Wait for connection to be ready
      if (mongoose.connection.readyState !== 1) {
        await new Promise(resolve => {
          const checkConnection = () => {
            if (mongoose.connection.readyState === 1) {
              resolve();
            } else {
              setTimeout(checkConnection, 100); // Check every 100ms
            }
          };
          checkConnection();
        });
        
        await this.initializeBucket();
      } else {
        await this.initializeBucket();
      }
    }
    
    if (!this.bucket) {
      throw new Error('Storage service not initialized');
    }
  }

  async uploadFile(file) {
    await this.ensureBucket();
    const { buffer, originalname, mimetype } = file;
    const uploadStream = this.bucket.openUploadStream(originalname, {
      contentType: mimetype
    });

    return new Promise((resolve, reject) => {
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      readableStream.pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => {
          resolve({
            fileId: uploadStream.id.toString(),
            filename: originalname,
            contentType: mimetype
          });
        });
    });
  }

  async getFile(fileId) {
    await this.ensureBucket();
    try {
      const _id = new mongoose.Types.ObjectId(fileId);
      const downloadStream = this.bucket.openDownloadStream(_id);
      
      return new Promise((resolve, reject) => {
        const chunks = [];
        downloadStream
          .on('data', chunk => chunks.push(chunk))
          .on('error', reject)
          .on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer);
          });
      });
    } catch (error) {
      throw new Error('File not found');
    }
  }

  async deleteFile(fileId) {
    await this.ensureBucket();
    try {
      const _id = new mongoose.Types.ObjectId(fileId);
      await this.bucket.delete(_id);
    } catch (error) {
      throw new Error('File not found');
    }
  }
}

module.exports = new StorageService(); 