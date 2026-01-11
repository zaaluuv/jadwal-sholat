async function getJadwalSholat() {
    const kotaId = "1206"; // ID untuk Kab. Bogor
    const date = new Date();
    const tahun = date.getFullYear();
    const bulan = (date.getMonth() + 1).toString().padStart(2, '0');
    const tanggal = date.getDate().toString().padStart(2, '0');

    try {
        // PERBAIKAN: Menggunakan api.myquran.com
        const url = `https://api.myquran.com/v2/sholat/jadwal/${kotaId}/${tahun}/${bulan}/${tanggal}`;
        console.log("Mengambil data dari:", url); // Untuk cek di console

        const response = await fetch(url);
        const data = await response.json();

        if (data.status) {
            const jadwal = data.data.jadwal;

            // Masukkan ke HTML
            document.getElementById('subuh').innerText = jadwal.subuh;
            document.getElementById('dzuhur').innerText = jadwal.dzuhur;
            document.getElementById('ashar').innerText = jadwal.ashar;
            document.getElementById('maghrib').innerText = jadwal.maghrib;
            document.getElementById('isya').innerText = jadwal.isya;
            
            console.log("Jadwal Berhasil Diupdate!");
        }
    } catch (error) {
        console.error("Waduh, ada error nih:", error);
    }
}

// Jangan lupa panggil fungsinya
getJadwalSholat();

function updateWaktu() {
    const sekarang = new Date(); 

    // Ambil Jam, Menit, dan Detik
    let jam = sekarang.getHours().toString().padStart(2, '0');
    let menit = sekarang.getMinutes().toString().padStart(2, '0');
    let detik = sekarang.getSeconds().toString().padStart(2, '0');

    // Tampilkan ke HTML
    document.getElementById('jam').innerText = `${jam}:${menit}:${detik}`;

    // Atur Tanggal (Bahasa Indonesia)
    const opsi = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('tgl').innerText = sekarang.toLocaleDateString('id-ID', opsi);
}

// Jalankan fungsi updateWaktu setiap 1 detik (1000 milidetik)
setInterval(updateWaktu, 1000);

// Panggil sekali di awal agar tidak menunggu 1 detik pertama
updateWaktu();

function updateCountdownSholat() {
    const sekarang = new Date();
    
    // Ambil semua waktu sholat dari teks yang sudah kita ambil dari API tadi
    const daftarSholat = [
        { nama: 'Subuh', waktu: document.getElementById('subuh').innerText },
        { nama: 'Dzuhur', waktu: document.getElementById('dzuhur').innerText },
        { nama: 'Ashar', waktu: document.getElementById('ashar').innerText },
        { nama: 'Maghrib', waktu: document.getElementById('maghrib').innerText },
        { nama: 'Isya', waktu: document.getElementById('isya').innerText }
    ];

    let targetWaktu = null;
    let namaSholat = "";

    // Mencari sholat berikutnya
    for (let s of daftarSholat) {
        if (s.waktu === "-:-") continue; // Lewati jika data API belum masuk

        const [jam, menit] = s.waktu.split(':');
        const waktuSholat = new Date();
        waktuSholat.setHours(jam, menit, 0);

        if (waktuSholat > sekarang) {
            targetWaktu = waktuSholat;
            namaSholat = s.nama;
            break; 
        }
    }

    // Jika semua sholat hari ini sudah lewat, targetnya adalah Subuh besok
    if (!targetWaktu) {
        namaSholat = "Subuh";
        // Logika sederhana: ambil waktu subuh hari ini tapi tambah 1 hari
        const [jam, menit] = daftarSholat[0].waktu.split(':');
        targetWaktu = new Date();
        targetWaktu.setDate(sekarang.getDate() + 1);
        targetWaktu.setHours(jam, menit, 0);
    }

    // Hitung selisih
    const selisih = targetWaktu - sekarang;
    const h = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    const m = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const s = Math.floor((selisih % (1000 * 60)) / 1000).toString().padStart(2, '0');

    // Update ke HTML
    document.getElementById('nama-sholat1').innerText = namaSholat;
    document.getElementById('timer-sholat').innerText = `${h}:${m}:${s}`;
}

// Jalankan countdown setiap 1 detik
setInterval(updateCountdownSholat, 1000);

function hitungRamadhan() {
    const sekarang = new Date();
    // UBAH DI SINI: Sesuaikan ke 18 Februari 2026
    const ramadhan = new Date('2026-02-18'); 
    
    const selisih = ramadhan - sekarang;
    
    // Hitung hari
    const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));

    const elemenText = document.getElementById('isi-text-jln');
    if (elemenText) {
        elemenText.innerHTML = `<marquee scrollamount="7">${hari} Hari Menuju Ramadhan | Jadwal Kajian: Ust. Fikri - Persiapan Ramadhan</marquee>`;
    }
}

// PANGGIL DI SINI AGAR JALAN
hitungRamadhan();

function gantiBackground() {
    const daftarGambar = [
        'https://source.unsplash.com/featured/?mosque,islamic',
        'https://source.unsplash.com/featured/?ramadan,mecca',
        'https://source.unsplash.com/featured/?arabic,architecture'
    ];

    const gambarAcak = daftarGambar[Math.floor(Math.random() * daftarGambar.length)];
    
    const elemen = document.getElementById('bg-layar'); 
    if(elemen) {
        elemen.style.backgroundImage = `url('${gambarAcak}')`;
    }
}
// Panggil sekali di luar setInterval agar saat refresh langsung muncul gambarnya
gantiBackground(); 
setInterval(gantiBackground, 10000);



// NOTE BUAT BELAJAR
// setInterval: Ini adalah perintah di JavaScript untuk menyuruh browser mengulang sebuah tugas (dalam hal ini, update jam) secara terus-menerus.
// padStart(2, '0'): Ini trik agar kalau jam menunjukkan angka 9, tampilannya jadi 09, bukan cuma 9.
//async & await: Karena kita mengambil data dari internet, kita tidak tahu berapa lama prosesnya (tergantung sinyal). await menyuruh kode untuk "tunggu sampai data datang" sebelum lanjut ke baris berikutnya.
//fetch(): Ini adalah fungsi sakti JS untuk mengambil data dari alamat URL luar.
//${tahun}/${bulan}/${tanggal}: Ini namanya Template Literals. Kita memasukkan variabel tanggal hari ini ke dalam alamat API agar jadwal yang muncul adalah jadwal hari ini, bukan tahun lalu.