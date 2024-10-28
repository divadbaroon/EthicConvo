"use server"

import { OpenAI } from 'openai';
import { supabaseClient } from '@/lib/database/supabase/client';
import type { Message } from '@/types';

const openai = new OpenAI({
  apiKey: "sk-0RObrqmC6DnQteT5g5RU1-CphqeL1pzKVWpmVAnq3eT3BlbkFJuOJ0brPh2a15AtQ61uNa6y-kInZ4goNkFj5SaTNeEA",
});

export async function analyzeMessages(messages: Message[], sessionId: string, groupId: string) {
    try {
      const [
        participationResults,
        topicResults,
        keywordResults,
        answerResults,
        perspectiveResults,
        popularOpinionResults,
        uniqueOpinionResults
      ] = await Promise.all([
        updateParticipationRate(messages, sessionId, groupId),
        updateTopicCoverage(messages, sessionId, groupId),
        updateKeywordTrends(messages, sessionId, groupId),
        updateGroupAnswers(messages, sessionId, groupId),
        updateEthicalPerspectives(messages, sessionId, groupId),
        updatePopularOpinions(messages, sessionId, groupId),
        updateUniqueOpinions(messages, sessionId, groupId)
      ]);
  
      const combinedResults = {
        participation: participationResults,
        topics: topicResults,
        keywords: keywordResults,
        answers: answerResults,
        perspectives: perspectiveResults,
        popular_opinions: popularOpinionResults,
        unique_opinions: uniqueOpinionResults
      };
  
      // Save combined results
      const { data, error } = await supabaseClient
        .from('combined_analysis')
        .upsert({
          session_id: sessionId,
          group_id: groupId,
          ...combinedResults,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'session_id,group_id'
        })
        .select('*')
        .single();
  
      if (error) {
        console.error('Error saving combined analysis:', error);
        throw error;
      }
  
      console.log('Combined analysis updated:', data);
      return combinedResults;
    } catch (error) {
      console.error('Error analyzing messages:', error);
      throw error;
    }
  }

async function updateParticipationRate(messages: Message[], sessionId: string, groupId: string) {
  const messageCounts = messages.reduce((acc, msg) => ({
    ...acc,
    [msg.user_id]: (acc[msg.user_id] || 0) + 1
  }), {} as Record<string, number>);

  const activeParticipants = Object.keys(messageCounts);
  const participationPercentage = (activeParticipants.length / messages.length) * 100;

  const result = {
    active_participants: activeParticipants,
    message_counts: messageCounts,
    participation_percentage: participationPercentage,
  };

  const { data, error } = await supabaseClient
    .from('participation_rates')
    .upsert({
      session_id: sessionId,
      group_id: groupId,
      ...result,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'session_id,group_id'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  console.log('Participation rate updated:', data);
  return result;
}

async function updateTopicCoverage(messages: Message[], sessionId: string, groupId: string) {
  const recentContent = messages.map(m => m.content).join('\n');
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Analyze the discussion and identify covered topics. Return as JSON with format: {\"covered_topics\": string[], \"coverage_percentage\": number, \"remaining_topics\": string[]}"
      },
      {
        role: "user",
        content: recentContent
      }
    ]
  });

  const analysis = JSON.parse(response.choices[0].message.content || '{}');

  const { data, error } = await supabaseClient
    .from('question_coverage')
    .upsert({
      session_id: sessionId,
      group_id: groupId,
      ...analysis,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'session_id,group_id'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  console.log('Topic coverage updated:', data);
  return analysis;
}

async function updateKeywordTrends(messages: Message[], sessionId: string, groupId: string) {
  const recentContent = messages.map(m => m.content).join('\n');
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Analyze the discussion and identify keyword trends. Return as JSON with format: {\"keywords\": [{\"term\": string, \"frequency\": number, \"trend_direction\": \"increasing\" | \"decreasing\" | \"stable\"}], \"trending_up\": string[], \"trending_down\": string[]}"
      },
      {
        role: "user",
        content: recentContent
      }
    ]
  });

  const analysis = JSON.parse(response.choices[0].message.content || '{}');

  const { data, error } = await supabaseClient
    .from('keyword_trends')
    .upsert({
      session_id: sessionId,
      group_id: groupId,
      ...analysis,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'session_id,group_id'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  console.log('Keyword trends updated:', data);
  return analysis;
}

async function updateGroupAnswers(messages: Message[], sessionId: string, groupId: string) {
  const recentContent = messages.map(m => m.content).join('\n');
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Analyze the discussion and identify answers to questions. Return as JSON with format: {\"answers\": [{\"question\": string, \"answer\": string, \"confidence_score\": number}], \"completeness_score\": number, \"quality_metrics\": object}"
      },
      {
        role: "user",
        content: recentContent
      }
    ]
  });

  const analysis = JSON.parse(response.choices[0].message.content || '{}');

  const { data, error } = await supabaseClient
    .from('group_answers')
    .upsert({
      session_id: sessionId,
      group_id: groupId,
      ...analysis,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'session_id,group_id'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  console.log('Group answers updated:', data);
  return analysis;
}

async function updateEthicalPerspectives(messages: Message[], sessionId: string, groupId: string) {
  const recentContent = messages.map(m => m.content).join('\n');
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Analyze the discussion and identify ethical perspectives. Return as JSON with format: {\"perspectives\": [{\"perspective\": string, \"frequency\": number, \"sentiment\": number}], \"diversity_score\": number, \"main_perspectives\": string[]}"
      },
      {
        role: "user",
        content: recentContent
      }
    ]
  });

  const analysis = JSON.parse(response.choices[0].message.content || '{}');

  const { data, error } = await supabaseClient
    .from('ethical_perspectives')
    .upsert({
      session_id: sessionId,
      group_id: groupId,
      ...analysis,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'session_id,group_id'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  console.log('Ethical perspectives updated:', data);
  return analysis;
}

async function updatePopularOpinions(messages: Message[], sessionId: string, groupId: string) {
  const recentContent = messages.map(m => m.content).join('\n');
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Analyze the discussion and identify popular opinions. Return as JSON with format: {\"opinions\": [{\"opinion\": string, \"agreement_level\": number, \"participant_count\": number}], \"top_opinions\": string[], \"controversy_score\": number}"
      },
      {
        role: "user",
        content: recentContent
      }
    ]
  });

  const analysis = JSON.parse(response.choices[0].message.content || '{}');

  const { data, error } = await supabaseClient
    .from('popular_opinions')
    .upsert({
      session_id: sessionId,
      group_id: groupId,
      ...analysis,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'session_id,group_id'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  console.log('Popular opinions updated:', data);
  return analysis;
}

async function updateUniqueOpinions(messages: Message[], sessionId: string, groupId: string) {
  const recentContent = messages.map(m => m.content).join('\n');
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Analyze the discussion and identify unique opinions. Return as JSON with format: {\"opinions\": [{\"opinion\": string, \"novelty_score\": number, \"participant\": string}], \"uniqueness_score\": number, \"notable_insights\": string[]}"
      },
      {
        role: "user",
        content: recentContent
      }
    ]
  });

  const analysis = JSON.parse(response.choices[0].message.content || '{}');

  const { data, error } = await supabaseClient
    .from('unique_opinions')
    .upsert({
      session_id: sessionId,
      group_id: groupId,
      ...analysis,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'session_id,group_id'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  console.log('Unique opinions updated:', data);
  return analysis;
}