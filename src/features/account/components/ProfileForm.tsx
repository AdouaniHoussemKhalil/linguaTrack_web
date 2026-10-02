import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Spinner } from "@quickadui/core";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@quickadui/forms";
import { toast } from "@quickadui/overlays";
import { languageLevels } from "@/features/auth";
import { getErrorMessage } from "@/lib/errors";
import { useUpdateProfile } from "../hooks/useAccount";
import { profileSchema, type ProfileFormSchema } from "../schemas";
import type { UserProfile } from "../types/Account";

export const ProfileForm = ({ user }: { user: UserProfile }) => {
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: user.first_name, lastName: user.last_name, level: user.level ?? "A2" },
  });
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const onSubmit = form.handleSubmit((values) => {
    updateProfile(values, {
      onSuccess: (profile) => {
        form.reset({ firstName: profile.first_name, lastName: profile.last_name, level: profile.level ?? values.level });
        toast({ variant: "success", title: "Profil enregistré" });
      },
      onError: (error) => toast({ variant: "danger", title: "Enregistrement impossible", description: getErrorMessage(error) }),
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>Votre nom et votre niveau de français.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {/* Hors FormField (non modifiable) : Label simple, FormLabel exige un FormField */}
            <div className="grid gap-2">
              <Label htmlFor="profile-email">Adresse email</Label>
              <Input id="profile-email" value={user.email} disabled readOnly />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input autoComplete="given-name" state={fieldState.invalid ? "error" : "default"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input autoComplete="family-name" state={fieldState.invalid ? "error" : "default"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau de français</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger ref={field.ref} onBlur={field.onBlur}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languageLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Utilisé pour adapter les corrections et les explications.</FormDescription>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending || !form.formState.isDirty} className="self-start">
              {isPending && <Spinner size="sm" label="Enregistrement en cours" />}
              Enregistrer
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
