import moment from 'moment';
import archiver from 'archiver';
import crypto from 'crypto';
import path from 'path';
import env from './env';

export default function downloadController(req, res) {
  const dateString = req.params.date;
  const date = moment(dateString, 'YYYYMMDD');
  const today = moment();

  if (!/^[0-9]{8}/.test(dateString) || !date.isValid() || date.isAfter(today)) {
    return res.status(404).send('Not found yo!');
  }

  const hash = crypto
    .createHmac('sha256', env('APP_KEY'))
    .update(dateString)
    .digest('hex')
    .slice(0, 13);

  const zip = archiver('zip');
  const xmlFilename = `${dateString}-gleif-concatenated-file-lei2.xml`;
  const zipFilename = `${xmlFilename}.${hash}.zip`;

  res.set('Content-Type', 'application/zip');
  res.set('Content-Disposition', `attachment; filename=${zipFilename}`);

  // res.attachment(zipFilename);

  zip.on('error', error => {
    res.status(500).send(error.message);
  });

  zip.pipe(res);

  zip.file(path.join(__dirname, 'gleif-data.xml'), { name: xmlFilename });

  zip.finalize();
}
