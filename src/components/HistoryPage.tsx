import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ArrowLeft, Clock, Award, Code, CheckCircle, XCircle, BarChart2, Globe, Layers, Flame, Calendar, Brain } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, BarChart, Bar, YAxis } from 'recharts';
import { PROBLEMS } from '../problems';
import { NeuralMap } from './NeuralMap';

interface HistoryPageProps {
  onBack: () => void;
  session: any;
  defaultTab?: 'analytics' | 'neural';
  onSelectProblem?: (problemId: string) => void;
}

/** Pure helper – computes all dashboard stats from submissions + a pre-captured timestamp */
function computeStats(submissions: any[], now: number) {
  const totalPassed = submissions.filter((s: any) => s.status === 'passed').length;
  const totalFailed = submissions.length - totalPassed;

  const pieData = [
    { name: 'Passed', value: totalPassed, color: '#10B981' },
    { name: 'Failed', value: totalFailed, color: '#EF4444' }
  ].filter(d => d.value > 0);

  const diffMap = { Easy: 0, Medium: 0, Hard: 0 };
  const langMap: Record<string, number> = {};
  const tagMap: Record<string, number> = {};

  submissions.forEach((s: any) => {
    const prob = PROBLEMS.find((p: any) => p.id === s.problem_id);
    if (prob) {
      diffMap[prob.difficulty as keyof typeof diffMap]++;
      (prob.tags as string[]).forEach((t: string) => tagMap[t] = (tagMap[t] || 0) + 1);
    }
    langMap[s.language] = (langMap[s.language] || 0) + 1;
  });

  const diffData = [
    { name: 'Easy', value: diffMap.Easy, color: '#10B981' },
    { name: 'Medium', value: diffMap.Medium, color: '#F59E0B' },
    { name: 'Hard', value: diffMap.Hard, color: '#EF4444' }
  ].filter(d => d.value > 0);

  const langData = Object.entries(langMap).map(([name, value]) => ({
    name: name.toUpperCase(),
    value,
    color: name === 'python' ? '#3776AB' : name === 'javascript' ? '#F7DF1E' : '#a78bce'
  }));

  const topTags = Object.entries(tagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Streak Calculation
  const uniqueDates = [...new Set(submissions.map((s: any) => new Date(s.created_at).toDateString()))]
    .map(d => new Date(d).getTime())
    .sort((a, b) => b - a);

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;

  if (uniqueDates.length > 0 && now > 0) {
    const todayStr = new Date(now).toDateString();
    const yesterdayStr = new Date(now - 86400000).toDateString();
    const lastSubDate = new Date(uniqueDates[0]).toDateString();

    if (lastSubDate === todayStr || lastSubDate === yesterdayStr) {
      currentStreak = 1;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const diff = (uniqueDates[i] - uniqueDates[i + 1]) / 86400000;
        if (Math.round(diff) === 1) currentStreak++;
        else break;
      }
    }

    tempStreak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const diff = (uniqueDates[i] - uniqueDates[i + 1]) / 86400000;
      if (Math.round(diff) === 1) tempStreak++;
      else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);
  }

  // Heatmap Data (Full Year - 52 Weeks)
  const heatmapData: { date: string; count: number }[] = [];
  if (now > 0) {
    const todayDate = new Date(now);
    for (let i = 363; i >= 0; i--) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      const dStr = d.toDateString();
      const count = submissions.filter((s: any) => new Date(s.created_at).toDateString() === dStr).length;
      heatmapData.push({ date: dStr, count });
    }
  }

  return { totalPassed, pieData, diffData, langData, topTags, currentStreak, maxStreak, heatmapData };
}
export const HistoryPage: React.FC<HistoryPageProps> = ({ onBack, session, defaultTab, onSelectProblem }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(15);
  const [fetchedAt, setFetchedAt] = useState(0);
  const [activeTab, setActiveTab] = useState<'analytics' | 'neural'>(defaultTab || 'analytics');

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('submissions')
        .select('id, problem_id, problem_title, status, language, created_at')
        .order('created_at', { ascending: false });

      if (error) console.error('Failed fetching submissions:', error);
      else setSubmissions(data || []);
      setFetchedAt(Date.now());
      setLoading(false);
    };

    if (session) fetchSubmissions();
  }, [session]);

  const { totalPassed, pieData, diffData, langData, topTags, currentStreak, maxStreak, heatmapData } = computeStats(submissions, fetchedAt);

  return (
    <div className="history-page-root" style={{ padding: '24px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-main)', minHeight: '100%', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={onBack} className="history-back-btn" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: 'all 0.2s' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Progress Dashboard</h1>
          <p className="history-loading" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>Review all solved tracks & execution analytics.</p>
        </div>
      </div>

      {/* Switcher Tab Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '4px',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        width: 'max-content',
        marginBottom: '28px'
      }}>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            background: activeTab === 'analytics' ? 'var(--bg-panel-light)' : 'transparent',
            border: activeTab === 'analytics' ? '1px solid var(--border-highlight)' : '1px solid transparent',
            color: activeTab === 'analytics' ? 'var(--accent-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'all 0.3s'
          }}
        >
          <BarChart2 size={15} /> Analytics Pulse
        </button>
        <button
          onClick={() => setActiveTab('neural')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            background: activeTab === 'neural' ? 'var(--bg-panel-light)' : 'transparent',
            border: activeTab === 'neural' ? '1px solid var(--border-highlight)' : '1px solid transparent',
            color: activeTab === 'neural' ? 'var(--accent-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'all 0.3s'
          }}
        >
          <Brain size={15} /> Neural Skill Galaxy
        </button>
      </div>

      <style>{`
        .heatmap-square:hover {
          transform: scale(1.3);
          z-index: 10;
          box-shadow: 0 0 10px var(--border-highlight);
        }
      `}</style>

      {loading ? (
        <p className="history-loading" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading timeline analytics...</p>
      ) : submissions.length === 0 ? (
        <div className="history-empty" style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-muted)' }}>
          <Code size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p>You haven't submitted any solutions yet! Start solving to see charts.</p>
        </div>
      ) : activeTab === 'neural' ? (
        <NeuralMap submissions={submissions} onSelectProblem={onSelectProblem || (() => {})} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* 📊 Metrics cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="glass-panel history-metric-card" style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Award size={28} color="#10B981" />
              <div><span className="history-metric-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Passed</span><h2 className="history-metric-value" style={{ margin: 0, color: 'var(--text-main)' }}>{totalPassed}</h2></div>
            </div>
            <div className="glass-panel history-metric-card" style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Clock size={28} color="#3B82F6" />
              <div><span className="history-metric-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Success Rate</span><h2 className="history-metric-value" style={{ margin: 0, color: 'var(--text-main)' }}>{submissions.length > 0 ? Math.round((totalPassed / submissions.length) * 100) : 0}%</h2></div>
            </div>
            <div className="glass-panel history-metric-card" style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Flame size={28} color="#EF4444" fill={currentStreak > 0 ? "#EF4444" : "none"} />
              <div><span className="history-metric-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Streak</span><h2 className="history-metric-value" style={{ margin: 0, color: 'var(--text-main)' }}>{currentStreak} Days</h2></div>
            </div>
            <div className="glass-panel history-metric-card" style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Award size={28} color="#F59E0B" />
              <div><span className="history-metric-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Best Streak</span><h2 className="history-metric-value" style={{ margin: 0, color: 'var(--text-main)' }}>{maxStreak} Days</h2></div>
            </div>
          </div>

          {/* 📅 Activity Heatmap */}
          <div className="glass-panel history-section-card" style={{ padding: '24px', borderRadius: '24px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="history-section-title" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Calendar size={16} /> Full Year Activity Pulse
              </h3>
              <div className="history-heatmap-legend-text" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>Less</span>
                {[0, 2, 5, 8].map(level => {
                  const color = level === 0 ? 'var(--bg-panel-light)' :
                    level < 3 ? 'color-mix(in srgb, var(--accent-primary) 30%, transparent)' :
                      level < 6 ? 'color-mix(in srgb, var(--accent-primary) 60%, transparent)' : 'var(--accent-primary)';
                  return <div key={level} style={{ width: '10px', height: '10px', background: color, borderRadius: '2px' }} />;
                })}
                <span>More</span>
              </div>
            </div>

            <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '15px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', gap: '16px', width: 'max-content', minWidth: '100%', justifyContent: 'flex-start', padding: '0 32px' }}>
                {/* Day Labels */}
                <div className="history-heatmap-day-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '24px', position: 'sticky', left: 0, background: 'var(--bg-panel)', zIndex: 5, paddingRight: '12px' }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className={`history-heatmap-day-label${i % 2 === 1 ? ' visible' : ''}`} style={{ height: '16px', fontSize: '0.7rem', color: i % 2 === 1 ? 'var(--text-muted)' : 'transparent', display: 'flex', alignItems: 'center' }}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grid with Month Labels */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', marginBottom: '8px', height: '16px', gap: '6px' }}>
                    {Array.from({ length: 52 }).map((_, i) => {
                      const date = new Date(heatmapData[i * 7]?.date);
                      const isNewMonth = i === 0 || date.getMonth() !== new Date(heatmapData[(i - 1) * 7]?.date).getMonth();

                      return (
                        <div key={i} className="history-heatmap-month-label" style={{ width: '16px', fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {isNewMonth ? date.toLocaleString('default', { month: 'short' }) : ''}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {Array.from({ length: 52 }).map((_, weekIdx) => (
                      <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {Array.from({ length: 7 }).map((_, dayIdx) => {
                          const dataIdx = weekIdx * 7 + dayIdx;
                          const data = heatmapData[dataIdx];
                          const color = data?.count === 0 ? 'var(--bg-panel-light)' :
                            data?.count < 3 ? 'color-mix(in srgb, var(--accent-primary) 30%, transparent)' :
                              data?.count < 6 ? 'color-mix(in srgb, var(--accent-primary) 60%, transparent)' : 'var(--accent-primary)';
                          return (
                            <div
                              key={dayIdx}
                              title={`${data?.date}: ${data?.count} submissions`}
                              className={`heatmap-square${data?.count === 0 ? ' history-heatmap-empty' : ''}`}
                              style={{
                                width: '16px',
                                height: '16px',
                                background: color,
                                borderRadius: '3px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, background 0.2s'
                              }}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 📈 Graphs Container Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            <div className="glass-panel history-section-card" style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', height: '300px' }}>
              <h3 className="history-section-title-main" style={{ fontSize: '0.95rem', marginBottom: '16px', color: 'var(--text-main)' }}>Solve Attempts breakdown</h3>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius="60%"
                    outerRadius="80%"
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={true}
                    animationDuration={800}
                    animationBegin={0}
                  >
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-panel-solid)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-panel history-section-card" style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', height: '300px' }}>
              <h3 className="history-section-title" style={{ fontSize: '0.85rem', marginBottom: '16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={16} /> Difficulty Breakdown
              </h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={diffData}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'var(--bg-panel-light)' }} contentStyle={{ background: 'var(--bg-panel-solid)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1000}
                  >
                    {diffData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-panel history-section-card" style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', height: '300px' }}>
              <h3 className="history-section-title" style={{ fontSize: '0.85rem', marginBottom: '16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={16} /> Language Proficiency
              </h3>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={langData}
                    innerRadius="55%"
                    outerRadius="75%"
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={true}
                    animationDuration={1200}
                  >
                    {langData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-panel-solid)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 🏷️ Top Topics */}
          <div className="glass-panel history-section-card" style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
            <h3 className="history-section-title" style={{ fontSize: '0.85rem', marginBottom: '16px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} /> Domain Coverage
            </h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {topTags.map(([tag, count]) => (
                <div key={tag} style={{ padding: '8px 16px', borderRadius: '12px', background: 'var(--bg-panel-light)', border: '1px solid var(--border-highlight)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="history-tag-name" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)' }}>{tag}</span>
                  <span className="history-tag-count" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-panel)', padding: '2px 6px', borderRadius: '4px' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 📋 Submissions List */}
          <div className="glass-panel history-section-card" style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
            <h3 className="history-section-title-main" style={{ fontSize: '0.95rem', marginBottom: '16px', color: 'var(--text-main)' }}>Recent Submissions</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead className="history-table-head">
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Problem</th>
                    <th style={{ padding: '12px' }}>Language</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.slice(0, displayLimit).map((s) => (
                    <tr key={s.id} className="history-table-row" style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{s.problem_title}</td>
                      <td className="history-table-lang" style={{ padding: '12px', textTransform: 'uppercase', fontStyle: 'italic', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.language}</td>
                      <td style={{ padding: '12px' }}>
                        {s.status === 'passed' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10B981', fontWeight: 700 }}><CheckCircle size={14} /> Pass</span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#EF4444', fontWeight: 700 }}><XCircle size={14} /> Fail</span>
                        )}
                      </td>
                      <td className="history-table-date" style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {submissions.length > displayLimit && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    onClick={() => setDisplayLimit(prev => prev + 20)}
                    className="history-load-more hover-lift"
                    style={{
                      background: 'var(--bg-panel-light)',
                      border: '1px solid var(--border-highlight)',
                      color: 'var(--accent-primary)',
                      padding: '8px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    Load More Submissions
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
