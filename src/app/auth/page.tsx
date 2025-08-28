'use client';
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {usePhoneNumber} from "@/hook";
import React, {useState, JSX} from "react";
import _ from './auth.module.css';
import {Input} from "@/components/ui/input"
import {useAuth} from "@/contexts";
import { cn } from "@/lib/utils"

const Page: React.FC = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState<string | null>(null)
  const { setToken } = useAuth()
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    setLoading(true)
    setErrorLoading(null)
    try {
      const response = await fetch('https://randomuser.me/api/?results=1&nat=us')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      const { results: [{ login: { uuid } }] } = result

      localStorage.setItem('token', uuid);
      localStorage.setItem('user', JSON.stringify(result));
      setToken(uuid)
    } catch (err: unknown) {
      setErrorLoading(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      // setLoading(false)
    }
  };
  const {
    phone,
    formattedPhone,
    error,
    isValid,
    isComplete,
    inputRef,
    handleChange,
    handleKeyDown,
    handlePaste,
    clear
  } = usePhoneNumber();
  return (
    <form
      onSubmit={(e) => handleFormSubmit(e)}
      className={_.form}
      aria-label="Phone number verification form"
      noValidate // Prevents browser default validation messages
    >
      <div className={_.fieldWrapper}>
        <Label
          htmlFor="phone"
          id="phone-label"
          className="flex items-center gap-2"
        >
          شماره موبایل خود را وارد کنید
          {phone.length !== 0 ? (
            <button
              type="button"
              onClick={() => clear()}
              aria-label="Clear phone number"
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
            >
              🔄
            </button>
          ) : null}
        </Label>

        <Input
          ref={inputRef}
          type="tel"
          id="phone"
          name="phone"
          value={formattedPhone}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          maxLength={15}
          placeholder="09123456789"
          dir="ltr"
          aria-labelledby="phone-label"
          aria-describedby={error ? "phone-error" : isValid ? "phone-success" : "phone-help"}
          aria-invalid={!!error}
          aria-required="true"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base",
            "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "file:text-foreground placeholder:text-muted-foreground md:text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive/50",
            isValid && "border-green-600 focus-visible:ring-green-600/50",
          )}
        />

        {/* Help text for screen readers */}
        <div id="phone-help" className="sr-only">
          شماره موبایل باید ۱۱ رقمی و با ۰۹ یا +۹۸ شروع شود
        </div>

        {/* Error message with ARIA */}
        {error ? (
          <span
            id="phone-error"
            className={_.errorMessage}
            role="alert"
            aria-live="assertive"
          >
        ⚠ {error}
      </span>
        ) : null}

        {/* Success message with ARIA */}
        {isValid ? (
          <span
            id="phone-success"
            className={_.successMessage}
            role="status"
            aria-live="polite"
          >
        ✓ شماره موبایل معتبر است
      </span>
        ) : null}
      </div>

      {isValid ? (
        <Button
          type="submit"
          className={_.submitBtn}
          aria-label={loading ? "در حال ارسال" : "ارسال کد تأیید"}
          aria-busy={loading}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="sr-only">در حال ارسال</span>
              <span aria-hidden="true">• • •</span>
            </>
          ) : (
            "ارسال"
          )}
        </Button>
      ) : null}
    </form>
  )
}

export default Page;
