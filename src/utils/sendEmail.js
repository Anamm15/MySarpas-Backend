const nodemailer = require('nodemailer');

async function sendEmail(to, status, namaRuangan, tanggal, jamAwal, jamAkhir, jenisKegiatan) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    }
  });

  if (status === 'approved') {
    let info = transporter.sendMail({
      from: '"MySarpras" <mysarpras60@gmail.com>',
      to: to,
      subject: 'Status Peminjaman Ruangan: Disetujui',
      html: `
        <div style="font-size: 18px; font-family: Arial, sans-serif;">
          <p>Yth. Bapak/Ibu/Saudara/i,</p>
          <p>Permohonan peminjaman ruangan Anda dengan detail sebagai berikut telah <b>DISETUJUI</b>:</p>
          <ul>
            <li><b>Ruangan:</b> ${namaRuangan}</li>
            <li><b>Tanggal:</b> ${tanggal}</li>
            <li><b>Jam:</b> ${jamAwal} - ${jamAkhir}</li>
            <li><b>Jenis Kegiatan:</b> ${jenisKegiatan}</li>
          </ul>
          <p>Silakan hadir sesuai waktu yang telah ditentukan dan menjaga kebersihan serta ketertiban ruangan selama digunakan.</p>
          <p>Terima kasih telah menggunakan layanan MySarpras.</p>
          <p>Hormat kami,<br/>Tim MySarpras</p>
        </div>
      `
    });
    console.log('Email terkirim: %s', info.messageId);
  }

  if (status === 'rejected') {
    let info = transporter.sendMail({
      from: '"MySarpras" <mysarpras60@gmail.com>',
      to: to,
      subject: 'Status Peminjaman Ruangan: Ditolak',
      html: `
        <div style="font-size: 18px; font-family: Arial, sans-serif;">
          <p>Yth. Bapak/Ibu/Saudara/i,</p>
          <p>Dengan hormat, kami sampaikan bahwa permohonan peminjaman ruangan Anda <b>TIDAK DAPAT DISETUJUI</b> dengan detail sebagai berikut:</p>
          <ul>
            <li><b>Ruangan:</b> ${namaRuangan}</li>
            <li><b>Tanggal:</b> ${tanggal}</li>
            <li><b>Jam:</b> ${jamAwal} - ${jamAkhir}</li>
            <li><b>Jenis Kegiatan:</b> ${jenisKegiatan}</li>
          </ul>
          <p>Penolakan ini dapat disebabkan oleh adanya jadwal yang bentrok atau alasan administratif lainnya.</p>
          <p>Silakan ajukan kembali permohonan dengan waktu atau ruangan yang berbeda.</p>
          <p>Terima kasih atas perhatian dan pengertiannya.</p>
          <p>Hormat kami,<br/>Tim MySarpras</p>
        </div>
      `
    });
    console.log('Email terkirim: %s', info.messageId);
  }

  if (status === 'canceled') {
    let info = transporter.sendMail({
      from: '"MySarpras" <mysarpras60@gmail.com>',
      to: to,
      subject: 'Status Peminjaman Ruangan: Dibatalkan',
      html: `
        <div style="font-size: 18px; font-family: Arial, sans-serif;">
          <p>Yth. Bapak/Ibu/Saudara/i,</p>
          <p>Dengan ini kami informasikan bahwa peminjaman ruangan yang sebelumnya telah diajukan <b>telah DIBATALKAN</b> dengan detail sebagai berikut:</p>
          <ul>
            <li><b>Ruangan:</b> ${namaRuangan}</li>
            <li><b>Tanggal:</b> ${tanggal}</li>
            <li><b>Jam:</b> ${jamAwal} - ${jamAkhir}</li>
            <li><b>Jenis Kegiatan:</b> ${jenisKegiatan}</li>
          </ul>
          <p>Jika pembatalan ini tidak Anda lakukan, atau Anda membutuhkan bantuan lebih lanjut, silakan hubungi admin MySarpras.</p>
          <p>Terima kasih atas perhatian Anda.</p>
          <p>Hormat kami,<br/>Tim MySarpras</p>
        </div>
      `
    });
    console.log('Email terkirim: %s', info.messageId);
  }
}

module.exports = sendEmail;
