import Link from "next/link";

export default function SupportPage() {
  return <main className="legal-page"><Link className="brand" href="/"><span className="brand-mark">Э</span><span>ЭКЗАМ</span></Link><h1>Поддержка</h1><p>В открытой версии работает демонстрационный раздел без сбора обращений. Рабочие контакты и защищённая форма появятся перед коммерческим запуском.</p><h2>Что подготовить для обращения</h2><ul><li>на каком экране возникла проблема;</li><li>какое действие вы выполняли;</li><li>устройство и браузер;</li><li>скриншот без персональных данных.</li></ul><p><Link className="button button-dark" href="/practice">Вернуться к заданиям</Link></p></main>;
}
