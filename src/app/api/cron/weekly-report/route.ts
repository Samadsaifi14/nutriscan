function buildWeeklyReportHTML(data: {
  firstName: string
  totalCalories: number
  avgDaily: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  daysLogged: number
  totalMeals: number
  worstProducts: any[]
  unsubscribeWeeklyUrl: string
  unsubscribeAllUrl: string
  baseUrl: string
}): string {

  const calorieStatus = data.avgDaily < 1500
    ? { label: 'Below target', color: '#3b82f6', advice: 'Try to eat a bit more to reach your daily calorie goal.' }
    : data.avgDaily > 2500
    ? { label: 'Above target', color: '#dc2626', advice: 'Consider reducing portion sizes or high-calorie snacks.' }
    : { label: 'On track', color: '#059669', advice: 'Excellent work keeping your calories in a healthy range!' }

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>

<body style="margin:0;padding:0;background:#f0fdf4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:28px;">
    <h1 style="font-size:26px;font-weight:900;">HealthOX</h1>
    <p style="font-size:13px;color:#6b7280;">Weekly Nutrition Report</p>
  </div>

  <div style="background:white;border-radius:20px;padding:24px;">

    <h2>Hey ${data.firstName} 👋</h2>

    <!-- Status -->
    <p style="color:${calorieStatus.color};font-weight:700;">
      ${calorieStatus.label} — ${calorieStatus.advice}
    </p>

    <!-- Stats -->
    <ul>
      <li>Total Calories: ${data.totalCalories}</li>
      <li>Daily Avg: ${data.avgDaily}</li>
      <li>Days Logged: ${data.daysLogged}/7</li>
      <li>Total Meals: ${data.totalMeals}</li>
    </ul>

    <!-- Macros -->
    <h3>🥩 Macros</h3>
    <ul>
      <li>Protein: ${data.totalProtein}g</li>
      <li>Carbs: ${data.totalCarbs}g</li>
      <li>Fat: ${data.totalFat}g</li>
    </ul>

    <!-- Encouragement -->
    <p style="font-size:14px;color:#374151;line-height:1.8;margin-top:20px;">
      ${
        data.daysLogged >= 5
          ? `Amazing consistency, ${data.firstName}! You logged ${data.daysLogged} days. 💪`
          : data.daysLogged >= 3
          ? `Good progress! Try hitting 5+ days next week.`
          : `Start small — even 1 meal per day tracking helps.`
      }
    </p>

    <!-- 🔥 NEW: Worst Products Section -->
    ${data.worstProducts && data.worstProducts.length > 0 ? `
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);margin:24px 0;"></div>

    <h3 style="font-size:15px;font-weight:800;color:#111827;margin:0 0 6px;">
      ⚠️ Watch out for these
    </h3>

    <p style="font-size:13px;color:#6b7280;margin:0 0 14px;">
      These products you scanned this week scored poorly on health:
    </p>

    ${data.worstProducts.map((p: any) => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fef2f2;border-radius:12px;margin-bottom:8px;border:1px solid #fecaca;">
        <span style="font-size:22px;">❌</span>
        <div>
          <p style="font-size:13px;font-weight:700;margin:0;">${p.product_name}</p>
          <p style="font-size:12px;color:#dc2626;margin:0;">
            Health score: ${p.ai_health_score}/10 — Unhealthy
          </p>
        </div>
      </div>
    `).join('')}

    <div style="padding:14px;background:#f0fdf4;border-radius:12px;margin-top:8px;border:1px solid #bbf7d0;">
      <p style="font-size:13px;font-weight:700;color:#059669;margin:0 0 6px;">
        💚 Healthier swaps to try
      </p>
      <p style="font-size:12px;color:#374151;margin:0;line-height:1.7;">
        Instead of packaged snacks, try roasted chana, makhana, fresh fruit, or homemade snacks this week.
        Small swaps make a big difference over time!
      </p>
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="text-align:center;margin-top:24px;">
      <a href="${data.baseUrl}/scan"
        style="padding:12px 20px;background:green;color:white;border-radius:8px;text-decoration:none;">
        Scan More Food →
      </a>
    </div>

  </div>

  <!-- Footer -->
  <p style="text-align:center;font-size:12px;margin-top:20px;">
    <a href="${data.unsubscribeWeeklyUrl}">Unsubscribe weekly</a> |
    <a href="${data.unsubscribeAllUrl}">Unsubscribe all</a>
  </p>

</div>
</body>
</html>
  `
}