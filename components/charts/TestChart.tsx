"use client"

import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { opinion: '1', group1: 4, group2: 3, group3: 2 },
  { opinion: '2', group1: 3, group2: 4, group3: 3 },
  { opinion: '3', group1: 5, group2: 2, group3: 4 },
  { opinion: '4', group1: 2, group2: 3, group3: 5 },
  { opinion: '5', group1: 3, group2: 5, group3: 3 },
]

const summaryPoints = [
  { text: "Opinion 3 is the most popular overall", highlight: "opinion3" },
  { text: "Group 2 strongly favors Opinion 5", highlight: "group2" },
  { text: "Group 3 has the most diverse range of opinions", highlight: "group3" },
  { text: "Opinion 4 is the least popular for Group 1", highlight: "group1" },
  { text: "Opinions 2 and 5 have the most balanced distribution", highlight: "balanced" },
]

export default function Component() {
  const [isDragging, setIsDragging] = useState(false)
  const [isDropped, setIsDropped] = useState(false)
  const [highlightedGroup, setHighlightedGroup] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true)
    e.dataTransfer.setData('text/plain', 'chart')
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDropped(true)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      <Card
        className={`w-full md:w-1/2 cursor-move ${isDragging ? 'opacity-50' : ''}`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <CardHeader>
          <CardTitle>Popular Opinions</CardTitle>
          <CardDescription>Drag and drop to see summary</CardDescription>
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
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="group1" stackId="a" fill="var(--color-group1)" />
                <Bar dataKey="group2" stackId="a" fill="var(--color-group2)" />
                <Bar dataKey="group3" stackId="a" fill="var(--color-group3)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <motion.div
        className="w-full md:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: isDropped ? 1 : 0, x: isDropped ? 0 : 50 }}
        transition={{ duration: 0.5 }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDropped && (
          <Card>
            <CardHeader>
              <CardTitle>Chart Summary</CardTitle>
              <CardDescription>Key insights from the opinion chart</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {summaryPoints.map((point, index) => (
                  <li
                    key={index}
                    className="p-2 rounded transition-colors duration-200"
                    style={{
                      backgroundColor:
                        highlightedGroup === point.highlight ? 'rgba(var(--chart-1-rgb), 0.1)' : 'transparent',
                    }}
                    onMouseEnter={() => setHighlightedGroup(point.highlight)}
                    onMouseLeave={() => setHighlightedGroup(null)}
                  >
                    {point.text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}