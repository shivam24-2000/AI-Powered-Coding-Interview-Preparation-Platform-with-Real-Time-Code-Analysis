import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ArrowLeft, Clock, Award, Code, CheckCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

interface HistoryPageProps {
  onBack: () => void;
  session: any;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onBack, session }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Failed fetching submissions:', error);
      else setSubmissions(data || []);
      setLoading(false);
    };

    if (session) fetchSubmissions();
  }, [session]);

  const totalPassed = submissions.filter(s => s.status === 'passed').length;
  const totalFailed = submissions.length - totalPassed;

  // Pie Chart Data
  const pieData = [
    { name: 'Passed', value: totalPassed, color: '#10B981' },
    { name: 'Failed', value: totalFailed, color: '#EF4444' }
  ].filter(d => d.value > 0);

  // Daily Solves Timer mapping layout setup
  const chartData = submissions.reduce((acc: any[], item) => {
    const date = new Date(item.created_at).toLocaleDateString();
    let exist = acc.find(d => d.date === date);
    if (!exist) {
      exist = { date, passed: 0, failed: 0 };
      acc.push(exist);
    }
    if (item.status === 'passed') exist.passed++;
    else exist.failed++;
    return acc;
  }, []).reverse();

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', color: '#fff', minHeight: '100vh', overflowY: 'auto' }}>
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
              <Award size={28} color="#A855F7" />
              <div><span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Total Passed</span><h2 style={{ margin: 0 }}>{totalPassed}</h2></div>
            </div>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Clock size={28} color="#3B82F6" />
              <div><span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Success Rate</span><h2 style={{ margin: 0 }}>{submissions.length > 0 ? Math.round((totalPassed / submissions.length) * 100) : 0}%</h2></div>
            </div>
          </div>

          {/* 📈 Graphs Container Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', height: '300px' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '16px', color: 'rgba(255,255,255,0.8)' }}>Solve Attempts breakdown</h3>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie data={pieData} innerRadius="60%" outerRadius="80%" dataKey="value" stroke="none">
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', height: '300px' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '16px', color: 'rgba(255,255,255,0.8)' }}>Activity Stream</h3>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} />
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  <Area type="monotone" dataKey="passed" stroke="#10B981" fill="rgba(16, 185, 129, 0.12)" />
                </AreaChart>
              </ResponsiveContainer>
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
                  {submissions.map((s, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.8)' }}>
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
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
