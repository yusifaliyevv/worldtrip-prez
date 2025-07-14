import { useState } from "react";
import { generateTravelPlan } from "../../services/aiService.js";
import { toast } from "react-toastify";
import styles from "./AiAssistant.module.css";

const AiAssistant = () => {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [startDate, setStartDate] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async (e) => {
    e.preventDefault();

    if (!destination || !budget || !days || !startDate) {
      toast.error("Enter all information.");
      return;
    }

    setLoading(true);
    try {
      const data = await generateTravelPlan({
        destination,
        budget,
        days,
        startDate,
      });
      setPlan(data.itinerary);
    } catch (error) {
      toast.error("An error occurred while creating the itinerary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Travel Planner</h2>

      <form className={styles.form} onSubmit={handleGeneratePlan}>
        <div className={styles.field}>
          <label htmlFor="destination">Destination</label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where are you traveling?"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="budget">Budget ($)</label>
          <input
            id="budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="E.g. 1000"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="days">Number of Days</label>
          <input
            id="days"
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="E.g. 5"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Generating..." : "Create Plan"}
        </button>
      </form>

      {plan && (
        <div className={styles.plan}>
          <h3 className={styles.planTitle}>{days}-Day Travel Plan</h3>
          <div
            className={styles.planContent}
            dangerouslySetInnerHTML={{
              __html: plan
                .replace(/(Day\s+\d+:.*\(\d{4}-\d{2}-\d{2}\))/g, (match) => {
                  return `<span style="font-size:20px; font-weight:bold; display:block; margin-top:12px;">${match}</span>`;
                })
                .replace(/(\d{2}:\d{2}-\d{2}:\d{2})/g, (match) => {
                  return `<span style="color:#3B993A; font-weight:bold;">${match}</span>`;
                })
                .replace(/-{3,}/g, "<hr style='margin:16px 0;'/>"),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
