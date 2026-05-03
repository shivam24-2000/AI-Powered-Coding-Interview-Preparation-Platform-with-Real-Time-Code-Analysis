import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ArrowLeft, Clock, Award, Code, CheckCircle, XCircle, BarChart2, Globe, Layers, Flame, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, BarChart, Bar, YAxis } from 'recharts';
import { PROBLEMS } from '../problems';

interface HistoryPageProps {
  onBack: () => void;
  session: any;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onBack, session }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(15);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('submissions')
        .select('id, problem_id, problem_title, status, language, created_at')
        .order('created_at', { ascending: false });

      if (error) console.error('Failed fetching submissions:', error);
      else setSubmissions(data || []);
      setLoading(false);
    };

    if (session) fetchSubmissions();
  }, [session]);

  const stats = React.useMemo(() => {
    const totalPassed = submissions.filter(s => s.status === 'passed').length;
    const totalFailed = submissions.length - totalPassed;

    const pieData = [
      { name: 'Passed', value: totalPassed, color: '#10B981' },
      { name: 'Failed', value: totalFailed, color: '#EF4444' }
    ].filter(d => d.value > 0);

    // 🏆 New: Difficulty Distribution
    const diffMap = { Easy: 0, Medium: 0, Hard: 0 };
    const langMap: Record<string, number> = {};
    const tagMap: Record<string, number> = {};

    submissions.forEach(s => {
      const prob = PROBLEMS.find(p => p.id === s.problem_id);
      if (prob) {
        diffMap[prob.difficulty as keyof typeof diffMap]++;
        prob.tags.forEach(t => tagMap[t] = (tagMap[t] || 0) + 1);
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
      color: name === 'python' ? '#3776AB' : name === 'javascript' ? '#F7DF1E' : '#A855F7'
    }));

    const topTags = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    // 🔥 New: Streak Calculation
    const uniqueDates = [...new Set(submissions.map(s => new Date(s.created_at).toDateString()))]
      .map(d => new Date(d).getTime())
      .sort((a, b) => b - a); // Newest first

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    if (uniqueDates.length > 0) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const lastSubDate = new Date(uniqueDates[0]).toDateString();

      if (lastSubDate === today || lastSubDate === yesterday) {
        currentStreak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const diff = (uniqueDates[i] - uniqueDates[i + 1]) / 86400000;
          if (Math.round(diff) === 1) currentStreak++;
          else break;
        }
      }

      // Max streak
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

    // 🗓️ New: Heatmap Data (Full Year - 52 Weeks)
    const heatmapData = [];
    const today = new Date();
    for (let i = 363; i >= 0; i--) { // 52 Weeks
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toDateString();
      const count = submissions.filter(s => new Date(s.created_at).toDateString() === dStr).length;
      heatmapData.push({ date: dStr, count });
    }

    return { totalPassed, pieData, diffData, langData, topTags, currentStreak, maxStreak, heatmapData };
  }, [submissions]);

  const { totalPassed, pieData, diffData, langData, topTags, currentStreak, maxStreak, heatmapData } = stats;

  return (
    <div style={{ padding: '24px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', color: '#fff', minHeight: '100%', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', padding: '10px', borderRadius: '12px' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>Progress Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: 0 }}>Review all solved tracks & execution analytics.</p>
        </div>
      </div>

      <style>{`
        .heatmap-square:hover {
          transform: scale(1.3);
          z-index: 10;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }
      `}</style>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading timeline analytics...</p>
      ) : submissions.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'rgba(255,255,255,0.3)' }}>
          <Code size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p>You haven't submitted any solutions yet! Start solving to see charts.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* 📊 Metrics cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Award size={28} color="#10B981" />
              <div><span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Total Passed</span><h2 style={{ margin: 0 }}>{totalPassed}</h2></div>
            </div>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Clock size={28} color="#3B82F6" />
              <div><span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Success Rate</span><h2 style={{ margin: 0 }}>{submissions.length > 0 ? Math.round((totalPassed / submissions.length) * 100) : 0}%</h2></div>
            </div>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Flame size={28} color="#EF4444" fill={currentStreak > 0 ? "#EF4444" : "none"} />
              <div><span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Current Streak</span><h2 style={{ margin: 0 }}>{currentStreak} Days</h2></div>
            </div>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Award size={28} color="#F59E0B" />
              <div><span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Best Streak</span><h2 style={{ margin: 0 }}>{maxStreak} Days</h2></div>
            </div>
          </div>

          {/* 📅 Activity Heatmap */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Calendar size={16} /> Full Year Activity Pulse
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                <span>Less</span>
                {[0, 2, 5, 8].map(level => {
                  const color = level === 0 ? 'rgba(255,255,255,0.05)' :
                    level < 3 ? 'rgba(168, 85, 247, 0.3)' :
                      level < 6 ? 'rgba(168, 85, 247, 0.6)' : 'rgba(168, 85, 247, 1)';
                  return <div key={level} style={{ width: '10px', height: '10px', background: color, borderRadius: '2px' }} />;
                })}
                <span>More</span>
              </div>
            </div>

            <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '15px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', gap: '16px', width: 'max-content', minWidth: '100%', justifyContent: 'flex-start', padding: '0 32px' }}>
                {/* Day Labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '24px', position: 'sticky', left: 0, background: 'var(--bg-panel)', zIndex: 5, paddingRight: '12px' }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} style={{ height: '16px', fontSize: '0.7rem', color: i % 2 === 1 ? 'rgba(255,255,255,0.3)' : 'transparent', display: 'flex', alignItems: 'center' }}>
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
                        <div key={i} style={{ width: '16px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
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
                          const color = data?.count === 0 ? 'rgba(255,255,255,0.05)' :
                            data?.count < 3 ? 'rgba(168, 85, 247, 0.3)' :
                              data?.count < 6 ? 'rgba(168, 85, 247, 0.6)' : 'rgba(168, 85, 247, 1)';
                          return (
                            <div
                              key={dayIdx}
                              title={`${data?.date}: ${data?.count} submissions`}
                              className="heatmap-square"
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
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', height: '300px' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '16px', color: 'rgba(255,255,255,0.8)' }}>Solve Attempts breakdown</h3>
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
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', height: '300px' }}>
              <h3 style={{ fontSize: '0.85rem', marginBottom: '16px', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={16} /> Difficulty Breakdown
              </h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={diffData}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
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

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', height: '300px' }}>
              <h3 style={{ fontSize: '0.85rem', marginBottom: '16px', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 🏷️ Top Topics */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <h3 style={{ fontSize: '0.85rem', marginBottom: '16px', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} /> Domain Coverage
            </h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {topTags.map(([tag, count]) => (
                <div key={tag} style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#D8B4FE' }}>{tag}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 📋 Submissions List */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '16px', color: 'rgba(255,255,255,0.8)' }}>Recent Submissions</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                    <th style={{ padding: '12px' }}>Problem</th>
                    <th style={{ padding: '12px' }}>Language</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.slice(0, displayLimit).map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.8)' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{s.problem_title}</td>
                      <td style={{ padding: '12px', textTransform: 'uppercase', fontStyle: 'italic', fontSize: '0.75rem' }}>{s.language}</td>
                      <td style={{ padding: '12px' }}>
                        {s.status === 'passed' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10B981', fontWeight: 700 }}><CheckCircle size={14} /> Pass</span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#EF4444', fontWeight: 700 }}><XCircle size={14} /> Fail</span>
                        )}
                      </td>
                      <td style={{ padding: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {submissions.length > displayLimit && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    onClick={() => setDisplayLimit(prev => prev + 20)}
                    style={{
                      background: 'rgba(168, 85, 247, 0.1)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      color: '#D8B4FE',
                      padding: '8px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                    className="hover-lift"
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
