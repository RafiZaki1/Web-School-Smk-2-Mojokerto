<?php

namespace App\Mail;

use App\Models\TransaksiBankMini;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Invoice pembayaran SPP yang sudah lunas lewat Tripay.
 */
class InvoiceSppMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Buat email invoice untuk satu transaksi (relasi siswa dan tagihan sudah dimuat).
     *
     * @param  TransaksiBankMini  $transaksi
     */
    public function __construct(public TransaksiBankMini $transaksi) {}

    /**
     * Subjek email.
     *
     * @return Envelope
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Invoice Lunas SPP '.$this->transaksi->order_id.' - SMK Negeri 2 Kota Mojokerto',
        );
    }

    /**
     * Isi email.
     *
     * @return Content
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.bank-mini.invoice',
            with: [
                'transaksi' => $this->transaksi,
                'urlKwitansi' => route('bank-mini.kwitansi', $this->transaksi->order_id),
            ],
        );
    }
}
