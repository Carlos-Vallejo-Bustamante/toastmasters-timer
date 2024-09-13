import { Github, Twitter, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Carlos Vallejo. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              asChild
            >
              <a
                href="https://twitter.com/carlosdevyseo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter de Carlos Vallejo"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              asChild
            >
              <a
                href="mailto:carlosvallejo.webmaster@gmail.com"
                aria-label="Email de Carlos Vallejo"
              >
                <Mail className="h-5 w-5" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              asChild
            >
              <a
                href="https://github.com/Carlos-Vallejo-Bustamante/toastmasters-timer"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Repositorio del proyecto en GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}