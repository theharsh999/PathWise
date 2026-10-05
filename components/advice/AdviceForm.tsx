'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { categories } from '@/data/categories';
import { submitQuestion } from '@/services/adviceService';
import { useQuestionsStore } from '@/store/useQuestionsStore';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Disclaimer } from '@/components/common/Disclaimer';

const schema = z.object({
  category: z.string().min(1, 'Please choose a category.'),
  question: z.string().min(10, 'At least 10 characters.').max(500),
  context: z.string().max(1000).optional(),
  outcome: z.string().max(200).optional(),
  urgency: z.enum(['Low', 'Medium', 'High']),
});

type FormValues = z.infer<typeof schema>;

export function AdviceForm() {
  const router = useRouter();
  const { add } = useQuestionsStore();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { urgency: 'Medium' } });

  const questionLength = watch('question')?.length ?? 0;

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const question = await submitQuestion(values);
    add(question);
    router.push(`/advice/${question.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <label className="text-sm font-medium block mb-1.5">Category</label>
        <Select className="w-full" {...register('category')}>
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
        {errors.category && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.category.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Your question</label>
        <Textarea className="min-h-[110px]" placeholder="Tell us what you're dealing with..." {...register('question')} />
        <div className="flex justify-between text-xs muted mt-1">
          <span style={{ color: errors.question ? 'var(--danger)' : undefined }}>{errors.question?.message}</span>
          <span>{questionLength}/500</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">
          Context <span className="muted font-normal">(optional)</span>
        </label>
        <Textarea className="min-h-[70px]" placeholder="Anything else that would help us understand your situation..." {...register('context')} />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">
          Desired outcome <span className="muted font-normal">(optional)</span>
        </label>
        <Input placeholder="What would a good outcome look like?" {...register('outcome')} />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Urgency</label>
        <div className="flex gap-2">
          {(['Low', 'Medium', 'High'] as const).map((u) => (
            <label key={u} className="chip cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-ink">
              <input type="radio" value={u} className="hidden" {...register('urgency')} /> {u}
            </label>
          ))}
        </div>
      </div>

      <Disclaimer />
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Thinking it through…' : 'Get my advice'}
      </Button>
    </form>
  );
}
