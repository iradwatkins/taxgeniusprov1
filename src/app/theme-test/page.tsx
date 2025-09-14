"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Palette } from "lucide-react";

export default function ThemeTestPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const colorSamples = [
    { name: "Background", style: { backgroundColor: "var(--background)", color: "var(--foreground)" } },
    { name: "Primary", style: { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" } },
    { name: "Secondary", style: { backgroundColor: "var(--secondary)", color: "var(--secondary-foreground)" } },
    { name: "Accent", style: { backgroundColor: "var(--accent)", color: "var(--accent-foreground)" } },
    { name: "Muted", style: { backgroundColor: "var(--muted)", color: "var(--muted-foreground)" } },
    { name: "Destructive", style: { backgroundColor: "var(--destructive)", color: "var(--destructive-foreground)" } },
    { name: "Card", style: { backgroundColor: "var(--card)", color: "var(--card-foreground)" } },
    { name: "Border", style: { backgroundColor: "var(--border)", color: "var(--foreground)" } },
  ];

  const chartColors = [
    { name: "Chart 1", style: { backgroundColor: "var(--chart-1)" } },
    { name: "Chart 2", style: { backgroundColor: "var(--chart-2)" } },
    { name: "Chart 3", style: { backgroundColor: "var(--chart-3)" } },
    { name: "Chart 4", style: { backgroundColor: "var(--chart-4)" } },
    { name: "Chart 5", style: { backgroundColor: "var(--chart-5)" } },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">OKLCH Tangerine Theme Test</h1>
            <p className="text-muted-foreground">
              Verifying 100% OKLCH color implementation
            </p>
          </div>
          <Button onClick={toggleTheme} size="lg" variant="outline">
            {theme === "light" ? (
              <>
                <Moon className="mr-2 h-5 w-5" />
                Switch to Dark
              </>
            ) : (
              <>
                <Sun className="mr-2 h-5 w-5" />
                Switch to Light
              </>
            )}
          </Button>
        </div>

        {/* Current Theme Badge */}
        <Badge className="mb-6" variant="default">
          <Palette className="mr-1 h-3 w-3" />
          Current Theme: {theme === "light" ? "Light Mode" : "Dark Mode"}
        </Badge>

        {/* Main Color Samples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Main Color Palette</CardTitle>
            <CardDescription>
              All colors are using OKLCH color space for better perceptual uniformity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {colorSamples.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div
                    style={color.style}
                    className="rounded-lg p-4 h-24 flex items-center justify-center font-medium border"
                  >
                    {color.name}
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    {color.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart Colors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Chart Colors</CardTitle>
            <CardDescription>
              Specialized colors for data visualization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {chartColors.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div
                    style={color.style}
                    className="rounded-lg h-20 border"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    {color.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Component Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Component Examples</CardTitle>
            <CardDescription>
              Testing various UI components with OKLCH colors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button variant="default">Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tangerine Signature */}
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Tangerine Theme Signature</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              The signature tangerine orange color: oklch(0.6397 0.1720 36.4421)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              This vibrant tangerine color is the heart of our theme, providing
              warmth and energy to the interface while maintaining excellent
              readability and accessibility.
            </p>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-12 text-center text-muted-foreground">
          <p className="text-sm">
            All colors are defined in OKLCH color space for superior color consistency
          </p>
          <p className="text-xs mt-2">
            OKLCH provides perceptual uniformity, better gradients, and wide gamut support
          </p>
        </div>
      </div>
    </div>
  );
}