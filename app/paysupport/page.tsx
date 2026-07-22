import Link from "next/link";

export default function PaySupportPage() {
  return <main className="legal-page"><Link className="brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link><h1>Поддержка оплаты</h1><p>Реальная оплата в MVP не подключена. Состояния pending, paid и refunded/expired существуют только в серверном демо-контуре для проверки продукта.</p><h2>После подключения провайдера</h2><p>Доступ будет открываться только после серверного подтверждения успешного платежа. Закрытие формы оплаты само по себе не выдаёт доступ.</p></main>;
}
