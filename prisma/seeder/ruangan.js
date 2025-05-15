const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedRuangan() {
  console.log('Seeding Ruangan...');

  await prisma.ruangan.createMany({
    data: [
      {
        namaRuangan: 'Teater A',
        kapasitas: 100,
        Gedung: 'Teater',
        deskripsi:
          'Ruang auditorium Teater A untuk kuliah umum, seminar, atau presentasi.',
        fasilitas: 'AC,Proyektor',
      },
      {
        namaRuangan: 'Teater B',
        kapasitas: 100,
        Gedung: 'Teater',
        deskripsi:
          'Ruang auditorium Teater B untuk kuliah umum, seminar, atau presentasi.',
        fasilitas: 'AC,Proyektor',
      },
      {
        namaRuangan: 'Teater C',
        kapasitas: 100,
        Gedung: 'Teater',
        deskripsi:
          'Ruang auditorium Teater C yang cocok untuk kegiatan presentasi dan perkuliahan.',
        fasilitas: 'AC,Proyektor',
      },
      {
        namaRuangan: 'Aula SCC lantai 3',
        kapasitas: 150,
        Gedung: 'SCC',
        deskripsi:
          'Aula besar di lantai 3 SCC, ideal untuk seminar, workshop, dan rapat umum.',
        fasilitas: 'AC,Proyektor,Sound system',
      },
      {
        namaRuangan: 'SCC lantai 1',
        kapasitas: 150,
        Gedung: 'SCC',
        deskripsi:
          'Ruang multifungsi di lantai 1 SCC untuk berbagai kegiatan organisasi.',
        fasilitas: 'AC,Proyektor,Sound system',
      },
      {
        namaRuangan: 'Selasar KPA',
        kapasitas: 50,
        Gedung: 'KPA',
        deskripsi:
          'Area semi-terbuka di KPA, cocok untuk pameran kecil atau diskusi informal.',
        fasilitas: 'AC',
      },
      {
        namaRuangan: 'Indoor Hall TW1',
        kapasitas: 250,
        Gedung: 'Tower 1',
        deskripsi:
          'Hall indoor di Tower 1 untuk pameran, bazar, atau event kampus berskala besar.',
        fasilitas: 'AC,Proyektor,Panggung,Sound system',
      },
      {
        namaRuangan: 'Indoor Hall TW2',
        kapasitas: 200,
        Gedung: 'Tower 2',
        deskripsi:
          'Hall indoor di TW2 untuk event kampus, seminar, dan kegiatan organisasi.',
        fasilitas: 'AC,Proyektor,Panggung,Sound system',
      },
    ],
    skipDuplicates: true, // optional: skips insertion if a unique constraint is violated
  });

  console.log('Ruangan seeding complete!');
  await prisma.$disconnect();
}

seedRuangan().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
