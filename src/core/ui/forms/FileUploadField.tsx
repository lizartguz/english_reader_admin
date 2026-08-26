import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { ButtonLoader } from '@/core/ui/feedback/ButtonLoader';

interface FileUploadFieldProps {
  /** Extensiones aceptadas por el selector, por ejemplo `.png,.jpg`. */
  accept: string;
  /** Valida el archivo antes de subirlo; devuelve el mensaje de error o `null`. */
  validate: (file: File) => string | null;
  onSelect: (file: File) => void;
  onValidationError: (message: string) => void;
  uploading?: boolean;
  label?: string;
  /** Texto de ayuda con formatos y tamaños permitidos. */
  hint?: string;
  disabled?: boolean;
}

/**
 * Campo de carga de archivos reutilizable (doc 08/11).
 *
 * Valida formato y tamaño **antes** de enviar, para no gastar una subida en un
 * archivo que la API va a rechazar. El input real queda oculto porque su
 * apariencia nativa no es consistente entre navegadores; el botón lo dispara.
 */
export function FileUploadField({
  accept,
  validate,
  onSelect,
  onValidationError,
  uploading = false,
  label = 'Seleccionar archivo',
  hint,
  disabled = false,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validate(file);
    // El input se limpia siempre para permitir reintentar con el mismo archivo.
    event.target.value = '';

    if (error) onValidationError(error);
    else onSelect(file);
  }

  return (
    <div className="space-y-2">
      <ButtonLoader
        type="button"
        loading={uploading}
        loadingText="Cargando…"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <Upload /> {label}
      </ButtonLoader>

      <input ref={inputRef} type="file" className="sr-only" accept={accept} onChange={handleChange} />

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
