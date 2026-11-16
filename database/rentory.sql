-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 16, 2026 at 08:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rentory`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_peminjaman_inventaris`
--

CREATE TABLE `detail_peminjaman_inventaris` (
  `id_detail` int(10) UNSIGNED NOT NULL,
  `id_peminjaman_inv` int(10) UNSIGNED NOT NULL,
  `id_unit` int(10) UNSIGNED NOT NULL,
  `tgl_kembali` datetime DEFAULT NULL,
  `kondisi_kembali` enum('Baik','Rusak Ringan','Rusak Berat') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gedung`
--

CREATE TABLE `gedung` (
  `id_gedung` int(10) UNSIGNED NOT NULL,
  `nama_gedung` varchar(100) NOT NULL,
  `lokasi` varchar(150) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `kapasitas` int(11) DEFAULT 0,
  `fasilitas` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gedung`
--

INSERT INTO `gedung` (`id_gedung`, `nama_gedung`, `lokasi`, `deskripsi`, `kapasitas`, `fasilitas`) VALUES
(1, 'Lecture Building', 'Kampus Tengah', 'Gedung Perkuliahan Utama', 0, ''),
(2, 'Gedung AS Biologi', 'Kampus Barat', 'Gedung Fakultas MIPA', 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `inventaris`
--

CREATE TABLE `inventaris` (
  `id_inventaris` int(10) UNSIGNED NOT NULL,
  `nama_barang` varchar(100) NOT NULL,
  `kategori` varchar(50) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inventaris`
--

INSERT INTO `inventaris` (`id_inventaris`, `nama_barang`, `kategori`, `deskripsi`) VALUES
(1, 'Proyektor Epson HD', 'Elektronik', 'Proyektor HDMI 3500 Lumens'),
(2, 'Wireless Microphone Set', 'Audio', 'Set 2 Mic Wireless Shure'),
(3, 'soundsystem', 'Elektronik', NULL),
(4, 'HDMI', 'Elektronik', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `peminjaman_inventaris`
--

CREATE TABLE `peminjaman_inventaris` (
  `id_peminjaman_inv` int(10) UNSIGNED NOT NULL,
  `id_user` int(10) UNSIGNED NOT NULL,
  `nama_kegiatan` varchar(150) NOT NULL,
  `id_admin` int(10) UNSIGNED DEFAULT NULL,
  `tgl_pinjam` datetime NOT NULL DEFAULT current_timestamp(),
  `tgl_rencana_kembali` datetime DEFAULT NULL,
  `status` enum('Pending','Approved','Dipinjam','Rejected','Selesai') NOT NULL DEFAULT 'Pending',
  `catatan_admin` text DEFAULT NULL,
  `tgl_keputusan` datetime DEFAULT NULL,
  `file_surat` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `peminjaman_ruang`
--

CREATE TABLE `peminjaman_ruang` (
  `id_peminjaman_ruang` int(10) UNSIGNED NOT NULL,
  `id_user` int(10) UNSIGNED NOT NULL,
  `id_gedung` int(10) UNSIGNED NOT NULL,
  `id_ruangan` int(10) UNSIGNED DEFAULT NULL,
  `nama_kegiatan` varchar(150) NOT NULL,
  `tgl_mulai` datetime NOT NULL,
  `tgl_selesai` datetime NOT NULL,
  `file_surat_pdf` varchar(255) NOT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `id_admin` int(10) UNSIGNED DEFAULT NULL,
  `catatan_admin` text DEFAULT NULL,
  `tgl_keputusan` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `file_surat` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `peminjaman_ruang`
--

INSERT INTO `peminjaman_ruang` (`id_peminjaman_ruang`, `id_user`, `id_gedung`, `id_ruangan`, `nama_kegiatan`, `tgl_mulai`, `tgl_selesai`, `file_surat_pdf`, `status`, `id_admin`, `catatan_admin`, `tgl_keputusan`, `created_at`, `file_surat`) VALUES
(1, 2, 1, 1, 'Opening Growth Class Udayana 2026', '2026-07-26 08:00:00', '2026-07-26 17:00:00', 'surat_opening_2026.pdf', 'Approved', 1, 'Disetujui. Ambil kunci di sekretariat Dekanat.', '2026-04-19 10:00:00', '2026-11-08 23:59:30', NULL),
(2, 2, 2, 2, 'Rapat Umum Growth Class Udayana 2026', '2026-08-02 13:00:00', '2026-08-02 16:00:00', 'surat_rapat_biologi.pdf', 'Pending', NULL, 'Sedang dalam peninjauan jadwal gedung.', NULL, '2026-11-08 23:59:30', NULL),
(3, 2, 1, 1, 'Rapat Teknis Growth Class Udayana 2026', '2026-08-02 09:00:00', '2026-08-02 12:00:00', 'surat_tekun.pdf', 'Rejected', 1, 'Ditolak: Ruangan dipakai acara fakultas pada jam tersebut.', '2026-04-22 14:30:00', '2026-11-08 23:59:30', NULL),
(4, 1, 1, NULL, '[INVENTARIS] MAGANG BEM FMIPA (BEM FMIPA) - (Tersedia: )', '2026-12-12 12:00:00', '2026-12-12 18:00:00', '', 'Pending', NULL, NULL, NULL, '2026-11-13 21:43:55', '/uploads/1794577435801-RAB_POK_LKMM-TM_FMIPA_2026___1_.pdf'),
(5, 1, 1, NULL, '[RUANG] INVASI UDAYANA 2026 (BEM FMIPA UNUD) - Ruang Seminar FMIPA', '2026-10-25 06:00:00', '2026-10-25 18:00:00', '', 'Pending', NULL, NULL, NULL, '2026-11-13 21:50:45', '/uploads/1794577845772-newpdffile__1_.pdf'),
(6, 1, 1, NULL, '[INVENTARIS] PIONEER PKM (BEM FMIPA) - (Tersedia: )', '2026-12-12 12:00:00', '2026-12-12 20:00:00', '', 'Pending', NULL, NULL, NULL, '2026-11-13 22:57:19', NULL),
(7, 1, 1, NULL, '[INVENTARIS] MAGANG BEM FMIPA (BEM FMIPA UNUD ) - (Tersedia: )', '2026-12-12 08:00:00', '2026-12-12 20:00:00', '', 'Pending', NULL, NULL, NULL, '2026-11-13 22:58:28', '/uploads/1794581908924-newpdffile__1_.pdf'),
(8, 1, 1, NULL, '[INVENTARIS] BEM FMIPA (BEM FMIPA) - (Tersedia: )', '0001-12-12 00:00:00', '0001-12-12 00:00:00', '', 'Approved', NULL, NULL, NULL, '2026-11-13 23:10:40', '/uploads/1794582640152-newpdffile__1_.pdf'),
(9, 5, 1, NULL, '[RUANG] USP (HIMA FARMA) - Aula Utama LB', '2026-11-15 08:00:00', '2026-11-15 19:00:00', '', 'Approved', NULL, NULL, NULL, '2026-11-16 08:47:32', '/uploads/1794790052811-newpdffile__1_.pdf'),
(10, 7, 2, 3, 'Kelas Kalkulus II (Kelas Reguler A Informatika 25)', '2026-12-13 08:00:00', '2026-12-13 09:40:00', '', 'Approved', NULL, NULL, NULL, '2026-11-16 15:24:26', '/uploads/1794813866476-newpdffile__1_.pdf'),
(11, 7, 2, NULL, 'Praktikum Farmacy 2025 (Mahasiswa Farmasi)', '2026-12-12 10:00:00', '2026-12-12 14:00:00', '', 'Approved', NULL, NULL, NULL, '2026-11-16 15:27:34', '/uploads/1794814054623-newpdffile__1_.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `ruangan`
--

CREATE TABLE `ruangan` (
  `id_ruangan` int(10) UNSIGNED NOT NULL,
  `id_gedung` int(10) UNSIGNED NOT NULL,
  `nama_ruangan` varchar(100) NOT NULL,
  `kapasitas` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `fasilitas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ruangan`
--

INSERT INTO `ruangan` (`id_ruangan`, `id_gedung`, `nama_ruangan`, `kapasitas`, `fasilitas`) VALUES
(1, 1, 'Aula Utama LB', 300, 'AC, Sound System, Proyektor, Panggung'),
(2, 2, 'Ruang Sidang Biologi', 50, 'AC, Whiteboard, Proyektor'),
(3, 2, 'ruang 1.4 Dekanat FMIPA', 20, 'AC dan Proyektor');

-- --------------------------------------------------------

--
-- Table structure for table `unit_inventaris`
--

CREATE TABLE `unit_inventaris` (
  `id_unit` int(10) UNSIGNED NOT NULL,
  `id_inventaris` int(10) UNSIGNED NOT NULL,
  `kode_barcode` varchar(50) NOT NULL,
  `status` enum('Tersedia','Dipinjam') NOT NULL DEFAULT 'Tersedia',
  `kondisi` enum('Baik','Rusak Ringan','Rusak Berat') NOT NULL DEFAULT 'Baik'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `unit_inventaris`
--

INSERT INTO `unit_inventaris` (`id_unit`, `id_inventaris`, `kode_barcode`, `status`, `kondisi`) VALUES
(1, 1, 'PRJ-001', 'Dipinjam', 'Baik'),
(2, 1, 'PRJ-002', 'Tersedia', 'Baik'),
(3, 2, 'MIC-001', 'Dipinjam', 'Baik');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(10) UNSIGNED NOT NULL,
  `nama` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `organisasi` varchar(100) DEFAULT NULL,
  `no_telp` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `nama`, `username`, `email`, `password_hash`, `role`, `organisasi`, `no_telp`, `created_at`) VALUES
(1, 'Administrator Rentory', 'admin', 'admin@rentory.ac.id', 'admin123', 'admin', 'Pengelola Prasarana', '081234567890', '2026-11-08 15:49:21'),
(2, 'Pandeaditya', 'aditya', 'aditya@student.ac.id', '$2a$12$eImiTXuWVxfM37uY4JANjOL.8Bqp5G9qO/q4M97WbQ6Wq37O445XW', 'user', 'BEM FMIPA', '089876543210', '2026-11-08 15:49:21'),
(3, 'pande aditya', 'pandeaditya', 'aditya111@gmail.com', 'pande1123', 'user', 'BEM FMIPA', '65054150521000', '2026-11-09 01:22:45'),
(4, 'I Pande Made Aditya Martha Dinata Putra', 'pandeaditya1123', 'adityapande020@gmail.com', 'pande1123', 'user', 'BEM FMIPA', '08564542254', '2026-11-09 01:31:03'),
(5, 'juwita maharani', 'juwita07', 'juwita@gmail.com', 'maharani07', 'user', 'BEM', '085645451524552', '2026-11-09 01:38:19'),
(6, 'yanto hebat', 'yanto12', 'yanto@gmail.com', 'yanto12', 'user', 'BEM', '081908112112', '2026-11-09 10:33:51'),
(7, 'aditya martha', 'martha07', 'martha@gmail.com', 'marthadinata07', 'user', 'bem', '025486512165416945', '2026-11-14 00:08:36'),
(8, 'Dera Syuryawan', 'dera07', 'syuryswan@gmail.com', 'syuryawan07', 'user', 'BEM FMIPA', '0877015155644', '2026-11-16 02:03:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_peminjaman_inventaris`
--
ALTER TABLE `detail_peminjaman_inventaris`
  ADD PRIMARY KEY (`id_detail`),
  ADD UNIQUE KEY `uq_detail_per_transaksi` (`id_peminjaman_inv`,`id_unit`),
  ADD KEY `idx_detail_unit` (`id_unit`);

--
-- Indexes for table `gedung`
--
ALTER TABLE `gedung`
  ADD PRIMARY KEY (`id_gedung`),
  ADD UNIQUE KEY `uq_gedung_nama` (`nama_gedung`);

--
-- Indexes for table `inventaris`
--
ALTER TABLE `inventaris`
  ADD PRIMARY KEY (`id_inventaris`);

--
-- Indexes for table `peminjaman_inventaris`
--
ALTER TABLE `peminjaman_inventaris`
  ADD PRIMARY KEY (`id_peminjaman_inv`),
  ADD KEY `idx_pi_user` (`id_user`),
  ADD KEY `idx_pi_admin` (`id_admin`);

--
-- Indexes for table `peminjaman_ruang`
--
ALTER TABLE `peminjaman_ruang`
  ADD PRIMARY KEY (`id_peminjaman_ruang`),
  ADD KEY `idx_pr_user` (`id_user`),
  ADD KEY `idx_pr_admin` (`id_admin`),
  ADD KEY `idx_pr_bentrok_gedung` (`id_gedung`,`status`,`tgl_mulai`,`tgl_selesai`),
  ADD KEY `idx_pr_bentrok_ruangan` (`id_ruangan`,`status`,`tgl_mulai`,`tgl_selesai`);

--
-- Indexes for table `ruangan`
--
ALTER TABLE `ruangan`
  ADD PRIMARY KEY (`id_ruangan`),
  ADD UNIQUE KEY `uq_ruangan_per_gedung` (`id_gedung`,`nama_ruangan`);

--
-- Indexes for table `unit_inventaris`
--
ALTER TABLE `unit_inventaris`
  ADD PRIMARY KEY (`id_unit`),
  ADD UNIQUE KEY `uq_unit_barcode` (`kode_barcode`),
  ADD KEY `idx_unit_inventaris` (`id_inventaris`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `uq_users_username` (`username`),
  ADD UNIQUE KEY `uq_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_peminjaman_inventaris`
--
ALTER TABLE `detail_peminjaman_inventaris`
  MODIFY `id_detail` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gedung`
--
ALTER TABLE `gedung`
  MODIFY `id_gedung` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inventaris`
--
ALTER TABLE `inventaris`
  MODIFY `id_inventaris` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `peminjaman_inventaris`
--
ALTER TABLE `peminjaman_inventaris`
  MODIFY `id_peminjaman_inv` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `peminjaman_ruang`
--
ALTER TABLE `peminjaman_ruang`
  MODIFY `id_peminjaman_ruang` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `ruangan`
--
ALTER TABLE `ruangan`
  MODIFY `id_ruangan` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `unit_inventaris`
--
ALTER TABLE `unit_inventaris`
  MODIFY `id_unit` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_peminjaman_inventaris`
--
ALTER TABLE `detail_peminjaman_inventaris`
  ADD CONSTRAINT `fk_detail_peminjaman` FOREIGN KEY (`id_peminjaman_inv`) REFERENCES `peminjaman_inventaris` (`id_peminjaman_inv`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detail_unit` FOREIGN KEY (`id_unit`) REFERENCES `unit_inventaris` (`id_unit`) ON UPDATE CASCADE;

--
-- Constraints for table `peminjaman_inventaris`
--
ALTER TABLE `peminjaman_inventaris`
  ADD CONSTRAINT `fk_pi_admin` FOREIGN KEY (`id_admin`) REFERENCES `users` (`id_user`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pi_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `peminjaman_ruang`
--
ALTER TABLE `peminjaman_ruang`
  ADD CONSTRAINT `fk_pr_admin` FOREIGN KEY (`id_admin`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pr_gedung` FOREIGN KEY (`id_gedung`) REFERENCES `gedung` (`id_gedung`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pr_ruangan` FOREIGN KEY (`id_ruangan`) REFERENCES `ruangan` (`id_ruangan`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pr_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `ruangan`
--
ALTER TABLE `ruangan`
  ADD CONSTRAINT `fk_ruangan_gedung` FOREIGN KEY (`id_gedung`) REFERENCES `gedung` (`id_gedung`) ON UPDATE CASCADE;

--
-- Constraints for table `unit_inventaris`
--
ALTER TABLE `unit_inventaris`
  ADD CONSTRAINT `fk_unit_inventaris` FOREIGN KEY (`id_inventaris`) REFERENCES `inventaris` (`id_inventaris`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
