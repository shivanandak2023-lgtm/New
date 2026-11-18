"use client";

import { useState, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Scientific Calculator - Free Online Calculator with Advanced Functions",
  description:
    "Free online scientific calculator with trigonometric, logarithmic, and exponential functions. Perform advanced math calculations with sin, cos, tan, log, ln, sqrt, and more.",
  keywords:
    "scientific calculator, online calculator, math calculator, advanced calculator, sin cos tan calculator, logarithm calculator, square root calculator, free calculator",
};

type HistoryEntry = {
  expression: string;
  result: string;
};

export default function ScientificCalculatorPage() {
  const [display, setDisplay] = useState<string>("0");
  const [expression, setExpression] = useState<string>("");
  const [hasResult, setHasResult] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isRadians, setIsRadians] = useState(true);

  const appendToDisplay = useCallback(
    (value: string) => {
      if (hasResult) {
        // After a result, if typing a number start fresh, if operator continue
        if ("+-*/^".includes(value)) {
          setExpression(display + value);
          setDisplay(display + value);
          setHasResult(false);
        } else {
          setExpression(value);
          setDisplay(value);
          setHasResult(false);
        }
        return;
      }

      if (display === "0" && value !== "." && !"+-*/".includes(value)) {
        setDisplay(value);
        setExpression(value);
      } else {
        setDisplay(display + value);
        setExpression(expression + value);
      }
    },
    [display, expression, hasResult]
  );

  const handleFunction = useCallback(
    (fn: string) => {
      if (hasResult) {
        setExpression(fn + "(" + display + ")");
        setDisplay(fn + "(" + display + ")");
        setHasResult(false);
      } else {
        const val = fn + "(";
        if (display === "0") {
          setDisplay(val);
          setExpression(val);
        } else {
          setDisplay(display + val);
          setExpression(expression + val);
        }
      }
    },
    [display, expression, hasResult]
  );

  const handleConstant = useCallback(
    (value: string) => {
      if (hasResult) {
        setDisplay(value);
        setExpression(value);
        setHasResult(false);
        return;
      }
      if (display === "0") {
        setDisplay(value);
        setExpression(value);
      } else {
        setDisplay(display + value);
        setExpression(expression + value);
      }
    },
    [display, expression, hasResult]
  );

  const clearAll = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setHasResult(false);
  }, []);

  const backspace = useCallback(() => {
    if (hasResult) {
      clearAll();
      return;
    }
    if (display.length <= 1) {
      setDisplay("0");
      setExpression("");
    } else {
      const newDisplay = display.slice(0, -1);
      setDisplay(newDisplay);
      setExpression(expression.slice(0, -1));
    }
  }, [display, expression, hasResult, clearAll]);

  const evaluate = useCallback(() => {
    try {
      let expr = expression || display;

      // Replace display symbols with JS math
      expr = expr.replace(/×/g, "*").replace(/÷/g, "/");
      expr = expr.replace(/π/g, `(${Math.PI})`);
      expr = expr.replace(/e(?![xp])/g, `(${Math.E})`);
      expr = expr.replace(/\^/g, "**");

      // Handle trig functions
      const toRad = isRadians ? "" : `*(${Math.PI}/180)`;

      expr = expr.replace(/sin\(/g, `Math.sin(${toRad ? "" : ""}(`);
      expr = expr.replace(/cos\(/g, `Math.cos(${toRad ? "" : ""}(`);
      expr = expr.replace(/tan\(/g, `Math.tan(${toRad ? "" : ""}(`);

      if (!isRadians) {
        // Wrap trig args with degree-to-radian conversion
        expr = expression || display;
        expr = expr.replace(/×/g, "*").replace(/÷/g, "/");
        expr = expr.replace(/π/g, `(${Math.PI})`);
        expr = expr.replace(/e(?![xp])/g, `(${Math.E})`);
        expr = expr.replace(/\^/g, "**");
        expr = expr.replace(/sin\(([^)]+)\)/g, `Math.sin(($1)*${Math.PI}/180)`);
        expr = expr.replace(/cos\(([^)]+)\)/g, `Math.cos(($1)*${Math.PI}/180)`);
        expr = expr.replace(/tan\(([^)]+)\)/g, `Math.tan(($1)*${Math.PI}/180)`);
      } else {
        expr = expression || display;
        expr = expr.replace(/×/g, "*").replace(/÷/g, "/");
        expr = expr.replace(/π/g, `(${Math.PI})`);
        expr = expr.replace(/e(?![xp])/g, `(${Math.E})`);
        expr = expr.replace(/\^/g, "**");
        expr = expr.replace(/sin\(([^)]+)\)/g, "Math.sin($1)");
        expr = expr.replace(/cos\(([^)]+)\)/g, "Math.cos($1)");
        expr = expr.replace(/tan\(([^)]+)\)/g, "Math.tan($1)");
      }

      expr = expr.replace(/log\(([^)]+)\)/g, "Math.log10($1)");
      expr = expr.replace(/ln\(([^)]+)\)/g, "Math.log($1)");
      expr = expr.replace(/sqrt\(([^)]+)\)/g, "Math.sqrt($1)");
      expr = expr.replace(/abs\(([^)]+)\)/g, "Math.abs($1)");

      // Safety check: only allow math operations
      const safeExpr = expr.replace(/Math\.(sin|cos|tan|log10|log|sqrt|abs|PI|E|pow)/g, "");
      if (/[a-zA-Z_$]/.test(safeExpr.replace(/\s/g, ""))) {
        setDisplay("Error");
        return;
      }

      // eslint-disable-next-line no-eval
      const result = eval(expr);

      if (typeof result !== "number" || !isFinite(result)) {
        setDisplay("Error");
        return;
      }

      const resultStr = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(10)).toString();
      const originalExpr = expression || display;

      setHistory((prev) => [{ expression: originalExpr, result: resultStr }, ...prev].slice(0, 20));
      setDisplay(resultStr);
      setExpression(resultStr);
      setHasResult(true);
    } catch {
      setDisplay("Error");
      setHasResult(true);
    }
  }, [display, expression, isRadians]);

  const CalcButton = ({
    label,
    onClick,
    className = "",
    wide = false,
  }: {
    label: string;
    onClick: () => void;
    className?: string;
    wide?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`${wide ? "col-span-2" : ""} px-2 py-3 rounded-lg border border-[var(--card-border)] font-medium text-base transition-colors hover:bg-[var(--muted-bg)] active:scale-95 ${className}`}
    >
      {label}
    </button>
  );

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/scientific-calculator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Scientific Calculator</h1>
        <p className="text-[var(--muted)] mb-8">
          A full-featured scientific calculator with trigonometric functions, logarithms, powers, and more. Perform advanced math calculations right in your browser.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Calculator */}
          <div className="md:col-span-2 tool-card">
            {/* Display */}
            <div className="bg-[var(--muted-bg)] rounded-lg p-4 mb-4">
              <div className="text-right text-sm text-[var(--muted)] min-h-[20px] break-all">
                {expression || "\u00A0"}
              </div>
              <div className="text-right text-3xl font-mono font-bold break-all min-h-[44px]">
                {display}
              </div>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setIsRadians(true)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  isRadians ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"
                }`}
              >
                RAD
              </button>
              <button
                onClick={() => setIsRadians(false)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  !isRadians ? "bg-[var(--primary)] text-white" : "bg-[var(--muted-bg)]"
                }`}
              >
                DEG
              </button>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {/* Row 1: Scientific functions */}
              <CalcButton label="sin" onClick={() => handleFunction("sin")} className="bg-blue-50 text-blue-700" />
              <CalcButton label="cos" onClick={() => handleFunction("cos")} className="bg-blue-50 text-blue-700" />
              <CalcButton label="tan" onClick={() => handleFunction("tan")} className="bg-blue-50 text-blue-700" />
              <CalcButton label="log" onClick={() => handleFunction("log")} className="bg-blue-50 text-blue-700" />
              <CalcButton label="ln" onClick={() => handleFunction("ln")} className="bg-blue-50 text-blue-700" />

              {/* Row 2: More functions */}
              <CalcButton label="sqrt" onClick={() => handleFunction("sqrt")} className="bg-blue-50 text-blue-700" />
              <CalcButton label="^" onClick={() => appendToDisplay("^")} className="bg-blue-50 text-blue-700" />
              <CalcButton label="(" onClick={() => appendToDisplay("(")} className="bg-gray-100" />
              <CalcButton label=")" onClick={() => appendToDisplay(")")} className="bg-gray-100" />
              <CalcButton label="abs" onClick={() => handleFunction("abs")} className="bg-blue-50 text-blue-700" />

              {/* Row 3: Constants and clear */}
              <CalcButton label="pi" onClick={() => handleConstant("π")} className="bg-purple-50 text-purple-700" />
              <CalcButton label="e" onClick={() => handleConstant("e")} className="bg-purple-50 text-purple-700" />
              <CalcButton label="C" onClick={clearAll} className="bg-red-50 text-red-700 font-bold" />
              <CalcButton label="DEL" onClick={backspace} className="bg-red-50 text-red-700" />
              <CalcButton label="÷" onClick={() => appendToDisplay("÷")} className="bg-amber-50 text-amber-700 font-bold" />

              {/* Row 4: Numbers */}
              <CalcButton label="7" onClick={() => appendToDisplay("7")} />
              <CalcButton label="8" onClick={() => appendToDisplay("8")} />
              <CalcButton label="9" onClick={() => appendToDisplay("9")} />
              <CalcButton label="×" onClick={() => appendToDisplay("×")} className="bg-amber-50 text-amber-700 font-bold" />
              <CalcButton label="%" onClick={() => appendToDisplay("%")} className="bg-amber-50 text-amber-700" />

              {/* Row 5 */}
              <CalcButton label="4" onClick={() => appendToDisplay("4")} />
              <CalcButton label="5" onClick={() => appendToDisplay("5")} />
              <CalcButton label="6" onClick={() => appendToDisplay("6")} />
              <CalcButton label="-" onClick={() => appendToDisplay("-")} className="bg-amber-50 text-amber-700 font-bold" />
              <CalcButton label="1/x" onClick={() => { if (display !== "0") setDisplay((1 / parseFloat(display)).toString()); }} className="bg-gray-100" />

              {/* Row 6 */}
              <CalcButton label="1" onClick={() => appendToDisplay("1")} />
              <CalcButton label="2" onClick={() => appendToDisplay("2")} />
              <CalcButton label="3" onClick={() => appendToDisplay("3")} />
              <CalcButton label="+" onClick={() => appendToDisplay("+")} className="bg-amber-50 text-amber-700 font-bold" />
              <CalcButton label="x^2" onClick={() => { if (display) { setExpression(`(${display})^2`); setDisplay(`(${display})^2`); } }} className="bg-gray-100" />

              {/* Row 7 */}
              <CalcButton label="0" onClick={() => appendToDisplay("0")} wide />
              <CalcButton label="." onClick={() => appendToDisplay(".")} />
              <CalcButton
                label="="
                onClick={evaluate}
                className="col-span-2 bg-[var(--primary)] text-white font-bold hover:opacity-90"
              />
            </div>
          </div>

          {/* History */}
          <div className="tool-card">
            <h2 className="text-lg font-bold mb-4">History</h2>
            {history.length === 0 ? (
              <p className="text-[var(--muted)] text-sm">No calculations yet.</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {history.map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-[var(--muted-bg)] cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      setDisplay(entry.result);
                      setExpression(entry.result);
                      setHasResult(true);
                    }}
                  >
                    <p className="text-xs text-[var(--muted)] break-all">{entry.expression}</p>
                    <p className="font-semibold text-[var(--primary)] break-all">= {entry.result}</p>
                  </div>
                ))}
              </div>
            )}
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="mt-3 text-sm text-red-600 hover:underline"
              >
                Clear History
              </button>
            )}
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About This Scientific Calculator</h2>
          <p>
            This free online scientific calculator lets you perform a wide range of mathematical operations beyond basic
            arithmetic. It supports trigonometric functions (sin, cos, tan), logarithms (log, ln), square roots, powers,
            and constants like pi and Euler&apos;s number (e).
          </p>

          <h2>Available Functions</h2>
          <ul>
            <li><strong>Basic Operations:</strong> Addition (+), Subtraction (-), Multiplication (*), Division (/)</li>
            <li><strong>Trigonometric:</strong> sin, cos, tan (with radian and degree modes)</li>
            <li><strong>Logarithmic:</strong> log (base 10), ln (natural log)</li>
            <li><strong>Powers &amp; Roots:</strong> x^y (power), sqrt (square root), x^2 (square)</li>
            <li><strong>Constants:</strong> pi (3.14159...), e (2.71828...)</li>
            <li><strong>Other:</strong> Absolute value (abs), Reciprocal (1/x), Parentheses for grouping</li>
          </ul>

          <h2>Radians vs Degrees</h2>
          <p>
            This calculator supports both radian and degree modes for trigonometric functions. By default, it uses radians.
            Toggle to &quot;DEG&quot; mode if you want to enter angles in degrees. Remember: 180 degrees = pi radians.
          </p>

          <h3>Order of Operations</h3>
          <p>
            The calculator follows the standard mathematical order of operations (PEMDAS/BODMAS): Parentheses/Brackets first,
            then Exponents/Orders, followed by Multiplication and Division (left to right), and finally Addition and
            Subtraction (left to right).
          </p>

          <h3>Tips for Accurate Calculations</h3>
          <ul>
            <li>Use parentheses to group complex expressions and ensure correct evaluation order</li>
            <li>Check that you are in the correct angle mode (RAD/DEG) before using trig functions</li>
            <li>Click on any history entry to reuse that result in a new calculation</li>
            <li>Use the DEL button to correct individual characters, or C to clear everything</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Scientific Calculator",
            description: META.description,
            url: `${SITE_URL}/tools/scientific-calculator`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
