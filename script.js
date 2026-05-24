/* =========================================================
   SCRIPT.JS - Sejarah-Mu (Landing Page & Belajar)
   =========================================================
   File ini berisi JavaScript murni (tanpa library) untuk:
   1. Membuka/menutup menu hamburger di tampilan mobile
   2. Menutup menu saat link diklik
   3. Menampilkan animasi elemen saat discroll
   4. Menangani navigasi sidebar (khusus halaman belajar dasar)
   
   Catatan: Untuk halaman belajar.html yang kompleks (punya
   progress bar), script ini akan OTOMATIS melewatkan fitur
   sidebar karena sudah ditangani oleh script di dalam 
   file belajar.html itu sendiri.
   ========================================================= */

// Tunggu sampai seluruh halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function () {

  // =========================================================
  // 1. HAMBURGER MENU (Navigasi Mobile)
  // =========================================================
  // Fungsi: Mengubah tombol hamburger menjadi tanda silang (X)
  //         dan menampilkan menu navigasi di tampilan HP.
  
  var tombolHamburger = document.getElementById('hamburger');
  var menuNavigasi = document.getElementById('navMenu');

  // Cek apakah elemen hamburger ada di halaman ini
  if (tombolHamburger && menuNavigasi) {
    
    // Event: Saat tombol hamburger diklik
    tombolHamburger.addEventListener('click', function () {
      // Toggle class 'active' untuk animasi tanda silang (X)
      tombolHamburger.classList.toggle('active');
      // Toggle class 'terbuka' untuk menampilkan/menyembunyikan menu
      menuNavigasi.classList.toggle('terbuka');
    });

    // Event: Saat salah satu link di dalam menu diklik
    var semuaLink = menuNavigasi.querySelectorAll('.nav-link');
    for (var i = 0; i < semuaLink.length; i++) {
      semuaLink[i].addEventListener('click', function () {
        // Hapus class animasi X pada hamburger
        tombolHamburger.classList.remove('active');
        // Sembunyikan kembali menu navigasinya
        menuNavigasi.classList.remove('terbuka');
      });
    }
  }


  // =========================================================
  // 2. ANIMASI SCROLL (Elemen Muncul Saat Di-scroll)
  // =========================================================
  // Fungsi: Mendeteksi elemen yang memiliki class 'animasi-muncul'.
  //         Jika elemen sudah terlihat di layar, tambahkan class 
  //         'tampil' agar elemen muncul dengan efek animasi CSS.

  var elemenAnimasi = document.querySelectorAll('.animasi-muncul');

  // Cek apakah browser mendukung IntersectionObserver
  if ('IntersectionObserver' in window) {
    
    // Buat pengamat (observer)
    var pengamat = new IntersectionObserver(function (masukan) {
      masukan.forEach(function (item) {
        // Jika elemen sudah terlihat di layar (setidaknya 15% bagian)
        if (item.isIntersecting) {
          // Tambahkan class 'tampil' untuk memicu animasi CSS
          item.target.classList.add('tampil');
          // Berhenti mengamati elemen ini (agar tidak berulang)
          pengamat.unobserve(item.target);
        }
      });
    }, {
      // Elemen dianggap "terlihat" jika 15% bagiannya muncul di layar
      threshold: 0.15
    });

    // Pasang pengamat ke setiap elemen yang ingin dianimasikan
    for (var i = 0; i < elemenAnimasi.length; i++) {
      pengamat.observe(elemenAnimasi[i]);
    }

  } else {
    // Fallback: Jika browser tidak mendukung (misalnya IE lama),
    // langsung tampilkan semua elemen tanpa animasi.
    for (var i = 0; i < elemenAnimasi.length; i++) {
      elemenAnimasi[i].classList.add('tampil');
    }
  }


  // =========================================================
  // 3. NAVIGASI SIDEBAR (Khusus Halaman Belajar Dasar)
  // =========================================================
  // Fungsi: Menangani klik pada daftar bab di sidebar.
  // 
  // PENGAMAN: 
  // Jika halaman memiliki elemen '#progressFill' (yang berarti
  // ini adalah halaman belajar.html versi LMS lengkap), maka
  // blok kode di bawah ini TIDAK AKAN DIJALANKAN. Hal ini untuk
  // mencegah bentrokan dengan script inline yang lebih canggih
  // di dalam file belajar.html.

  var itemBab = document.querySelectorAll('.bab-item');
  var kontenBab = document.querySelectorAll('.bab-konten');
  var daftarSubbab = document.querySelectorAll('.subbab-list');
  var progressFill = document.getElementById('progressFill'); // Pengaman

  // Logika hanya dijalankan jika ada item bab, DAN tidak ada progress bar LMS
  if (itemBab.length > 0 && !progressFill) {
    
    var itemSubbab = document.querySelectorAll('.subbab-item');

    // Fungsi internal untuk menampilkan bab
    function tampilBab(indexBab) {
      // Sembunyikan semua konten bab
      for (var i = 0; i < kontenBab.length; i++) {
        kontenBab[i].classList.remove('aktif');
      }
      // Hapus tanda aktif dari semua item bab di sidebar
      for (var i = 0; i < itemBab.length; i++) {
        itemBab[i].classList.remove('active');
      }
      // Tutup semua daftar subbab
      for (var i = 0; i < daftarSubbab.length; i++) {
        daftarSubbab[i].classList.remove('terbuka');
      }

      // Tampilkan bab yang dipilih
      if (kontenBab[indexBab]) {
        kontenBab[indexBab].classList.add('aktif');
      }
      // Tandai item bab yang dipilih
      if (itemBab[indexBab]) {
        itemBab[indexBab].classList.add('active');
        
        // Buka daftar subbab milik bab ini
        var subbabDariBab = itemBab[indexBab].nextElementSibling;
        if (subbabDariBab && subbabDariBab.classList.contains('subbab-list')) {
          subbabDariBab.classList.add('terbuka');
        }
      }
    }

    // Pasang event klik untuk setiap item bab
    for (var i = 0; i < itemBab.length; i++) {
      // Gunakan closure (IIFE) agar nilai 'i' tidak ikut berubah
      (function (index) {
        itemBab[index].addEventListener('click', function () {
          tampilBab(index);
        });
      })(i);
    }

    // Pasang event klik untuk setiap item subbab (scroll ke bagian tertentu)
    for (var i = 0; i < itemSubbab.length; i++) {
      itemSubbab[i].addEventListener('click', function () {
        var targetId = this.getAttribute('data-target');
        if (targetId) {
          var elemenTujuan = document.getElementById(targetId);
          if (elemenTujuan) {
            elemenTujuan.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }

    // Tampilkan bab pertama secara default saat halaman dibuka
    tampilBab(0);
  }

}); // Akhir dari DOMContentLoaded