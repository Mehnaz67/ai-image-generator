document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("generateForm");
    const generateBtn = document.getElementById("generateBtn");
    const placeholder = document.getElementById("placeholder");
    const spinner = document.getElementById("spinner");
    const generatedImage = document.getElementById("generatedImage");
    const actionBar = document.getElementById("actionBar");
    const downloadBtn = document.getElementById("downloadBtn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const prompt = document.getElementById("prompt").value;
        const style = document.getElementById("style").value;
        const [width, height] = document.getElementById("dimensions").value.split("x");

        // UI state: loading
        placeholder.classList.add("hidden");
        generatedImage.classList.add("hidden");
        actionBar.classList.add("hidden");
        spinner.classList.remove("hidden");
        generateBtn.disabled = true;

        try {
            const response = await fetch("/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: prompt,
                    style: style,
                    width: parseInt(width),
                    height: parseInt(height)
                })
            });

            const data = await response.json();

            if (data.status === "success") {
                generatedImage.src = data.image_url;

                generatedImage.onload = () => {
                    spinner.classList.add("hidden");
                    generatedImage.classList.remove("hidden");
                    actionBar.classList.remove("hidden");
                    generateBtn.disabled = false;
                };
            } else {
                alert(data.error || "Failed to generate image.");
                resetUI();
            }
        } catch (error) {
            alert("Error connecting to server.");
            resetUI();
        }
    });

    downloadBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(generatedImage.src);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `ai-image-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            window.open(generatedImage.src, "_blank");
        }
    });

    function resetUI() {
        spinner.classList.add("hidden");
        placeholder.classList.remove("hidden");
        generateBtn.disabled = false;
    }
});