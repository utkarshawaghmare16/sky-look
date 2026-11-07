export default function HowItWorks() {
  return (
    <section className="how container">
      <h2>How event booking works</h2>
      <div className="howSteps">
        <div className="howStep">
          <h3>1. Choose your event</h3>
          <p>Pick a service and tell us the venue and number of guests.</p>
        </div>
        <div className="howStep">
          <h3>2. Pick a date</h3>
          <p>Dates that are already confirmed are blocked, so no double booking.</p>
        </div>
        <div className="howStep">
          <h3>3. We confirm</h3>
          <p>We call you, confirm the date and plan the setup.</p>
        </div>
      </div>
    </section>
  );
}