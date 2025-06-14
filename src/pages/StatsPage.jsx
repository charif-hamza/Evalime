import { useEffect, useState } from 'react';
import { fetchTopicStats, fetchProgress } from '../services/api';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line } from 'recharts';

export default function StatsPage({ userId }) {
  const [topicStats, setTopicStats] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (!userId) return;
    fetchTopicStats(userId).then(setTopicStats).catch(() => {});
    fetchProgress(userId).then(setProgress).catch(() => {});
  }, [userId]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Performance</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ flex: '1 1 300px', height: 300 }}>
          <ResponsiveContainer>
            <RadarChart data={topicStats.map(t => ({
              subject: t.tag_id,
              A: t.correct,
              B: t.attempts
            }))}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar name="Correct" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: '1 1 300px', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={topicStats}>
              <XAxis dataKey="tag_id" />
              <YAxis />
              <Bar dataKey="correct" stackId="a" fill="#82ca9d" />
              <Bar dataKey="attempts" stackId="a" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: '1 1 600px', height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={progress}>
              <XAxis dataKey="day" hide />
              <YAxis />
              <Line type="monotone" dataKey="score" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <table style={{ marginTop: '2rem', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Tag</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {topicStats
            .map(t => ({ ...t, acc: t.attempts ? Math.round((t.correct / t.attempts) * 100) : 0 }))
            .sort((a, b) => a.acc - b.acc)
            .slice(0, 5)
            .map(t => (
              <tr key={t.tag_id}>
                <td>{t.tag_id}</td>
                <td>{t.acc}% <button style={{ marginLeft: 8 }}>Start Practice</button></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
