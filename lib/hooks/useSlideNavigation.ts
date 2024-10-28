import { useState, useEffect } from 'react';
import { Slide, TopOpinion, OpposingOpinion, UniqueOpinion, GraphDataItem } from "@/types";
import { initialSlides as defaultInitialSlides, topOpinionsData, opposingOpinions, uniqueOpinionsData, graphDataItems } from "@/lib/data/slidesData";

export const useSlideNavigation = (initialSlides: Slide[] = defaultInitialSlides) => {
    const [slides, setSlides] = useState<Slide[]>(initialSlides);
    const [currentSlide, setCurrentSlide] = useState(0);
  
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "ArrowRight") nextSlide();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [slides.length]);
  
    return { slides, setSlides, currentSlide, nextSlide, prevSlide };
  };

  export const usePanelData = () => {
    const [topOpinions, setTopOpinions] = useState<TopOpinion[]>(topOpinionsData);
    const [opinions, setOpinions] = useState<OpposingOpinion[]>(opposingOpinions);
    const [uniqueOpinions, setUniqueOpinions] = useState<UniqueOpinion[]>(uniqueOpinionsData);
    const [graphs, setGraphs] = useState<GraphDataItem[]>(graphDataItems);
    const [selectedPanel, setSelectedPanel] = useState<string>("Top Opinions");
  
    return { 
      topOpinions, setTopOpinions, 
      opinions, setOpinions, 
      uniqueOpinions, setUniqueOpinions, 
      graphs, setGraphs,
      selectedPanel, setSelectedPanel
    };
  };