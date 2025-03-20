export const CSV_IMPORT = {
  producer: 'csv-import-producer', // Flow Producer
  queueName: 'csv-import-queue', // Fila principal
  jobName: 'csv-import-job',
};

export const CSV_IMPORT_CHUNK = {
  queueName: 'csv-import-chunk-queue', // Subfila para chunks
  jobName: 'csv-import-chunk-job',
};
