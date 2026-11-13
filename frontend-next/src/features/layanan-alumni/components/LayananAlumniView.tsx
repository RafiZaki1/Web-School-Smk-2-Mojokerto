import { AlumniServiceForm } from "./AlumniServiceForm";
import { MyServiceRequests } from "./MyServiceRequests";

/** Isi halaman /layanan-alumni: form pengajuan dan status pengajuan perangkat ini. */
export function LayananAlumniView() {
  return (
    <>
      <header className="max-w-[760px]">
        <p className="text-[13px] font-semibold text-muted">Tata Usaha SMKN 2 Kota Mojokerto</p>
        <h1 className="mt-2 text-3xl font-bold text-heading sm:text-[34px]">Layanan Berkas Alumni</h1>
        <p className="mt-3 text-base leading-relaxed text-body">
          Ajukan pengambilan ijazah, cap tiga jari, atau legalisir sebelum datang ke sekolah. Datang ke ruang TU setelah status pengajuan menjadi Disetujui.
        </p>
      </header>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <AlumniServiceForm />
        <MyServiceRequests />
      </div>
    </>
  );
}
