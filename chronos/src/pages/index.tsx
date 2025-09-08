import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import {Spacer} from "@heroui/spacer";
import { Link } from "@heroui/link";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 overflow-hidden">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Bem-vindo ao </span>
          <span className={title({ color: "violet" })}>Chronos,</span>
          <br />
          <span className={title()}>uma pequena plataforma para </span>
          <span className={title({ color: "violet" })}>
            gerenciamento de eventos.
          </span>
          <div className={subtitle({ class: "mt-4" } )}>
            Agende seus compromissos e eventos com eficiência e simplicidade!
          </div>
        </div>

        <Spacer y={10} />

        <div>
          <Link href="/calendar">
            <Button variant="flat" color="secondary">Ir para o calendário</Button>
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
