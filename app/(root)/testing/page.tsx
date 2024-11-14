"use client"

import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, LineChart, Network } from 'lucide-react'
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { data, summaryContent } from "@/components/charts/chartDataTest"

export default function Component() {
  const [isDragging, setIsDragging] = useState(false)
  const [isDropped, setIsDropped] = useState(false)
  const [highlightedItems, setHighlightedItems] = useState<string[]>([])
  const [activeSection, setActiveSection] = useState<'overview' | 'insights' | 'relations' | null>(null)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true)
    e.dataTransfer.setData('text/plain', 'chart')
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDropped(true)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const opinion = data.find(item => item.opinion === label)
      return (
        <div className="bg-background p-4 rounded shadow-lg border border-border">
          <p className="font-bold mb-2">{label}</p>
          <p className="text-sm text-muted-foreground mb-3">{opinion?.description}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.fill }} className="font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderSideContent = () => (
    <AnimatePresence mode="wait">
      {activeSection && (
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold capitalize">
            {activeSection === 'overview' && 'Chart Overview'}
            {activeSection === 'insights' && 'Key Insights'}
            {activeSection === 'relations' && 'Data Relations'}
          </h3>
          <div className="space-y-4">
            {summaryContent[activeSection].map((item, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg bg-muted/50 transition-colors duration-200"
              >
                {item.text.split(' ').map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className={`inline-block px-1 rounded transition-colors ${
                      item.highlights.includes(word) 
                        ? 'text-primary underline decoration-primary/30 hover:decoration-primary cursor-pointer font-medium' 
                        : ''
                    }`}
                    onMouseEnter={() => {
                      if (item.highlights.includes(word)) {
                        setHighlightedItems(item.highlights)
                      }
                    }}
                    onMouseLeave={() => setHighlightedItems([])}
                  >
                    {word}{' '}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative flex flex-col md:flex-row gap-8 p-8">
        <Card
          className={`w-full md:w-1/2 cursor-move ${isDragging ? 'opacity-50' : ''} relative z-10`}
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Popular Opinions</CardTitle>
              <CardDescription>Drag and drop to see summary</CardDescription>
            </div>
            <div className="flex gap-2">
              <TooltipPrimitive>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setActiveSection(activeSection === 'overview' ? null : 'overview')}
                    className={activeSection === 'overview' ? 'bg-primary text-primary-foreground' : ''}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chart Overview</p>
                </TooltipContent>
              </TooltipPrimitive>

              <TooltipPrimitive>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setActiveSection(activeSection === 'insights' ? null : 'insights')}
                    className={activeSection === 'insights' ? 'bg-primary text-primary-foreground' : ''}
                  >
                    <LineChart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Key Insights</p>
                </TooltipContent>
              </TooltipPrimitive>

              <TooltipPrimitive>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setActiveSection(activeSection === 'relations' ? null : 'relations')}
                    className={activeSection === 'relations' ? 'bg-primary text-primary-foreground' : ''}
                  >
                    <Network className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Data Relations</p>
                </TooltipContent>
              </TooltipPrimitive>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                group1: {
                  label: "Group 1",
                  color: "hsl(var(--chart-1))",
                },
                group2: {
                  label: "Group 2",
                  color: "hsl(var(--chart-2))",
                },
                group3: {
                  label: "Group 3",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="opinion" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="group1" 
                    stackId="a" 
                    fill="var(--color-group1)" 
                    opacity={highlightedItems.length === 0 || highlightedItems.includes('group1') ? 1 : 0.3}
                  />
                  <Bar 
                    dataKey="group2" 
                    stackId="a" 
                    fill="var(--color-group2)" 
                    opacity={highlightedItems.length === 0 || highlightedItems.includes('group2') ? 1 : 0.3}
                  />
                  <Bar 
                    dataKey="group3" 
                    stackId="a" 
                    fill="var(--color-group3)" 
                    opacity={highlightedItems.length === 0 || highlightedItems.includes('group3') ? 1 : 0.3}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <motion.div
          className="absolute md:relative w-full md:w-1/2 md:left-0"
          animate={{
            x: activeSection ? 0 : '100%',
            opacity: activeSection ? 1 : 0,
          }}
          initial={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              {renderSideContent()}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TooltipProvider>
  )
}