import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, CardHeader, CardTitle, Spinner } from "@quickadui/core";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@quickadui/forms";
import { textModes } from "../constants";
import { analyzeSchema, MAX_TEXT_LENGTH, type AnalyzeFormSchema } from "../schemas";

interface AnalyzeFormProps {
  defaultValues: AnalyzeFormSchema;
  isPending: boolean;
  onSubmit: (values: AnalyzeFormSchema) => void;
}

export const AnalyzeForm = ({ defaultValues, isPending, onSubmit }: AnalyzeFormProps) => {
  const form = useForm<AnalyzeFormSchema>({
    resolver: zodResolver(analyzeSchema),
    defaultValues,
  });
  const text = useWatch({ control: form.control, name: "text" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Texte à analyser</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode de traitement</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger ref={field.ref} onBlur={field.onBlur}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {textModes.map((mode) => (
                        <SelectItem key={mode.value} value={mode.value}>
                          {mode.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {textModes.find((mode) => mode.value === field.value)?.description}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Texte original</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={12}
                      placeholder="Collez ici votre texte à corriger…"
                      className="min-h-56 resize-y leading-relaxed"
                      state={fieldState.invalid ? "error" : "default"}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-start justify-between gap-4">
                    <FormMessage />
                    <span
                      className={`ml-auto text-xs ${text.length > MAX_TEXT_LENGTH ? "text-danger-11" : "text-neutral-10"}`}
                    >
                      {text.length} / {MAX_TEXT_LENGTH}
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Spinner size="sm" label="Analyse en cours" />
                  Analyse en cours…
                </>
              ) : (
                "Analyser"
              )}
            </Button>
            {isPending && (
              <p className="text-center text-xs text-neutral-11" aria-live="polite">
                L'analyse peut prendre jusqu'à quelques minutes si le service principal est indisponible.
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
