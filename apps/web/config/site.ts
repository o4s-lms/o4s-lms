export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "O4S LMS",
  description:
    "Open Source Learning Management System",
  mainNav: [
    {
      title: "Cursos",
      href: "/app/courses",
    },
    {
      title: "Tarefas",
      href: "/app/tasks",
    },
  ],
  links: {
    twitter: "https://twitter.com/joseantcordeiro",
    github: "https://github.com/o4s-lms/o4s-lms",
    docs: "https://ui.shadcn.com",
  },
}
