import Link from "next/link";

export default function SupportPage() {
  return <main className="legal-page"><Link className="brand" href="/"><span className="brand-mark">С</span><span>СЛОВО</span></Link><h1>Поддержка</h1><p>В MVP поддержка работает как демонстрационный раздел. Перед запуском здесь появятся рабочие контакты школы и форма обращения.</p><h2>Что сообщить</h2><ul><li>на каком экране возникла проблема;</li><li>какое действие вы выполняли;</li><li>устройство и браузер;</li><li>скриншот без персональных данных.</li></ul><p><Link className="button button-dark" href="/dashboard">Вернуться в кабинет</Link></p></main>;
}
