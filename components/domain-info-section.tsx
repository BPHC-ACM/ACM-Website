"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { domainInfo, type DomainInfo } from "@/lib/domain-info"

export default function DomainInfoSection() {
    const [selectedDomain, setSelectedDomain] = useState<DomainInfo | null>(null)

    return (
        <section className="py-16 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Learn More About Each Domain</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore detailed information about our key technology domains and discover the opportunities in each field.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                    {domainInfo.map((domain) => {
                        const IconComponent = domain.icon
                        return (
                            <Card
                                key={domain.id}
                                className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20"
                                onClick={() => setSelectedDomain(domain)}
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="mb-4 flex justify-center">
                                        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <IconComponent className="h-8 w-8 text-primary" />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                        {domain.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Click to learn more about this domain</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <Dialog open={!!selectedDomain} onOpenChange={() => setSelectedDomain(null)}>
                    <DialogContent className="fixed inset-0 z-[9999] max-w-none h-screen w-screen m-0 rounded-none p-0 gap-0 translate-x-0 translate-y-0 left-0 top-0 bg-background [&>button]:hidden">
                        <DialogHeader className="p-8 pb-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {selectedDomain && (
                                        <>
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <selectedDomain.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <DialogTitle className="text-2xl font-bold">{selectedDomain.title}</DialogTitle>
                                        </>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedDomain(null)}
                                    className="h-12 w-12 hover:bg-primary/10 hover:text-primary text-primary"
                                >
                                    <X className="h-8 w-8" />
                                    <span className="sr-only">Close</span>
                                </Button>
                            </div>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="max-w-4xl mx-auto">
                                {selectedDomain && (
                                    <div className="prose prose-lg max-w-none dark:prose-invert">
                                        {selectedDomain.content.split("\n\n").map((paragraph, index) => (
                                            <p key={index} className="mb-6 leading-relaxed text-foreground">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    )
}
