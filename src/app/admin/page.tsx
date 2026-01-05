import { AdminHeroEditor } from "@/components/AdminHeroEditor";

export default function AdminPage() {
  return (
    <div className="grain">
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <AdminHeroEditor />
        </div>
      </section>
    </div>
  );
}


