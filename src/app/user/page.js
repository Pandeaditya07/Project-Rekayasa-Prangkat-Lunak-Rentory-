"use client";

export default function UserDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white tracking-tight">
        Dashboard Utama
      </h2>

      {/* Section 1: 4 Cards + Kalender Mini */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* 4 Cards (Grid 4 Kolom di Screen Besar) */}
        <div className="xl:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-[#18535e]/80 border border-[#23707e]/50 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-lg min-h-[140px]">
            <p className="text-[11px] font-medium text-cyan-100/80 mb-2">
              Ketersediaan
              <br />
              Gedung
            </p>
            <p className="text-2xl font-black text-white">12 Gedung</p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#18535e]/80 border border-[#23707e]/50 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-lg min-h-[140px]">
            <p className="text-[11px] font-medium text-cyan-100/80 mb-2">
              Gedung Yang
              <br />
              Dipinjam
            </p>
            <p className="text-2xl font-black text-white">2 Gedung</p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#18535e]/80 border border-[#23707e]/50 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-lg min-h-[140px]">
            <p className="text-[11px] font-medium text-cyan-100/80 mb-2">
              Ketersediaan Inventaris
            </p>
            <p className="text-2xl font-black text-white">12 Unit</p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#18535e]/80 border border-[#23707e]/50 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-lg min-h-[140px]">
            <p className="text-[11px] font-medium text-cyan-100/80 mb-2">
              Inventaris Yang
              <br />
              Dipinjam
            </p>
            <p className="text-2xl font-black text-white">5 Unit</p>
          </div>
        </div>

        {/* Widget Kalender Mini Kanan */}
        <div className="xl:col-span-3 bg-[#0d2229] border border-[#15343d] rounded-2xl p-4 text-xs shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between font-semibold text-slate-300 mb-3">
            <button className="text-slate-400 hover:text-white">&lt;</button>
            <span className="font-bold">April 2023</span>
            <button className="text-slate-400 hover:text-white">&gt;</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-500 mb-2 text-[10px]">
            <span>Lu</span>
            <span>Ma</span>
            <span>Du</span>
            <span>Dr</span>
            <span>Vo</span>
            <span>Se</span>
            <span>Mo</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-slate-300 text-[11px]">
            <span className="text-slate-600">28</span>
            <span className="text-slate-600">29</span>
            <span className="text-slate-600">30</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span className="rounded-full bg-cyan-600 font-bold text-white flex items-center justify-center w-5 h-5 mx-auto">
              9
            </span>
            <span>10</span>
            <span>11</span>
            <span>12</span>
            <span>13</span>
            <span>14</span>
            <span>15</span>
            <span>16</span>
            <span>17</span>
            <span>18</span>
            <span>19</span>
            <span>20</span>
            <span>21</span>
            <span>22</span>
            <span>23</span>
            <span>24</span>
            <span>25</span>
            <span>26</span>
            <span>27</span>
            <span>28</span>
            <span>29</span>
            <span>30</span>
            <span>31</span>
            <span className="text-slate-600">1</span>
          </div>
        </div>
      </div>

      {/* Section 2: Tabel Aktivitas Terakhir */}
      <div className="bg-[#0d2229] border border-[#15343d] rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">
          Aktivitas Terakhir
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#183d47] text-slate-400">
                <th className="py-3 px-2 font-semibold">Tanggal</th>
                <th className="py-3 px-2 font-semibold">user</th>
                <th className="py-3 px-2 font-semibold">Aktivitas</th>
                <th className="py-3 px-2 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132e36]">
              {/* Item 1 */}
              <tr>
                <td className="py-4 px-2 text-slate-300 whitespace-nowrap">
                  19 April 2026
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-slate-500 flex items-center justify-center text-[10px] text-slate-300">
                      👤
                    </div>
                    <span className="text-slate-200">Pandeaditya</span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <p className="font-bold text-white">
                    Opening Growth Class Udayana 2026 - Aula Lecture Building
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    BEM FMIPA - Komunikasi dan Informasi | Minggu, 26 Juli 2026
                  </p>
                </td>
                <td className="py-4 px-2 text-center whitespace-nowrap">
                  <span className="inline-block bg-[#1eb854] text-white font-bold text-[10px] px-5 py-1.5 rounded-full shadow">
                    ACC
                  </span>
                </td>
              </tr>

              {/* Item 2 */}
              <tr>
                <td className="py-4 px-2 text-slate-300 whitespace-nowrap">
                  20 Juni 2026
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-slate-500 flex items-center justify-center text-[10px] text-slate-300">
                      👤
                    </div>
                    <span className="text-slate-200">Pandeaditya</span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <p className="font-bold text-white">
                    Rapat Umum Growth Class Udayana 2026 - Gedung AS Biologi
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    BEM FMIPA - Komunikasi dan Informasi | Minggu, 2 Agustus
                    2026
                  </p>
                </td>
                <td className="py-4 px-2 text-center whitespace-nowrap">
                  <span className="inline-block bg-[#d99b26] text-white font-bold text-[10px] px-4 py-1.5 rounded-full shadow">
                    Pending
                  </span>
                </td>
              </tr>

              {/* Item 3 */}
              <tr>
                <td className="py-4 px-2 text-slate-300 whitespace-nowrap">
                  22 April 2026
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-slate-500 flex items-center justify-center text-[10px] text-slate-300">
                      👤
                    </div>
                    <span className="text-slate-200">Pandeaditya</span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <p className="font-bold text-white">
                    Rapat Teknis Growth Class Udayana 2026 - Denakat Lantai...
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    BEM FMIPA - Komunikasi dan Informasi | Minggu, 2 Agustus
                    2026
                  </p>
                </td>
                <td className="py-4 px-2 text-center whitespace-nowrap">
                  <span className="inline-block bg-[#bd2424] text-white font-bold text-[10px] px-4 py-1.5 rounded-full shadow">
                    Rejected
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
