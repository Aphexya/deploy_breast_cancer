// Sample Data untuk Testing
const SAMPLE_DATA = {
    benign: {
        radius_mean: 11.42,
        texture_mean: 17.62,
        perimeter_mean: 73.34,
        area_mean: 403.5,
        smoothness_mean: 0.102,
        compactness_mean: 0.067,
        concavity_mean: 0.029,
        concave_points_mean: 0.015,
        symmetry_mean: 0.155,
        fractal_dimension_mean: 0.038,
        radius_se: 0.194,
        texture_se: 0.746,
        perimeter_se: 1.455,
        area_se: 17.10,
        smoothness_se: 0.007,
        compactness_se: 0.010,
        concavity_se: 0.011,
        concave_points_se: 0.004,
        symmetry_se: 0.018,
        fractal_dimension_se: 0.002,
        radius_worst: 12.74,
        texture_worst: 20.65,
        perimeter_worst: 81.50,
        area_worst: 492.1,
        smoothness_worst: 0.140,
        compactness_worst: 0.127,
        concavity_worst: 0.105,
        concave_points_worst: 0.037,
        symmetry_worst: 0.277,
        fractal_dimension_worst: 0.081
    },

    malignant: {
        radius_mean: 20.29,
        texture_mean: 14.34,
        perimeter_mean: 135.10,
        area_mean: 1297.0,
        smoothness_mean: 0.100,
        compactness_mean: 0.132,
        concavity_mean: 0.198,
        concave_points_mean: 0.104,
        symmetry_mean: 0.180,
        fractal_dimension_mean: 0.058,
        radius_se: 0.757,
        texture_se: 0.781,
        perimeter_se: 5.438,
        area_se: 94.44,
        smoothness_se: 0.006,
        compactness_se: 0.031,
        concavity_se: 0.039,
        concave_points_se: 0.011,
        symmetry_se: 0.020,
        fractal_dimension_se: 0.004,
        radius_worst: 24.20,
        texture_worst: 19.20,
        perimeter_worst: 166.20,
        area_worst: 1809.0,
        smoothness_worst: 0.133,
        compactness_worst: 0.280,
        concavity_worst: 0.430,
        concave_points_worst: 0.195,
        symmetry_worst: 0.387,
        fractal_dimension_worst: 0.071
    }

};

class CancerPredictionForm {
    constructor() {
        this.form = document.getElementById('predictionForm');
        this.inputs = this.form.querySelectorAll('input[type="number"]');
        this.progressFill = document.getElementById('progressFill');
        this.loading = document.getElementById('loading');
        this.resultContainer = document.getElementById('resultContainer');
        this.resultText = document.getElementById('resultText');
        this.resultDetails = document.getElementById('resultDetails');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgress();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePrediction();
        });

        this.inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
                this.updateProgress();
            });
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });

        document.getElementById('fillBenignBtn').addEventListener('click', () => {
            this.fillFormData(SAMPLE_DATA.benign);
            this.showNotification('✅ Data contoh JINAK telah dimasukkan!');
        });

        document.getElementById('fillMalignantBtn').addEventListener('click', () => {
            this.fillFormData(SAMPLE_DATA.malignant);
            this.showNotification('⚠️ Data contoh GANAS telah dimasukkan!');
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearForm();
        });
    }

    validateInput(input) {
        const value = parseFloat(input.value);
        const feedback = input.closest('.input-container').querySelector('.input-feedback');
        if (input.value === '') {
            feedback.textContent = '';
            feedback.classList.remove('show', 'valid', 'invalid');
            return;
        }

        if (isNaN(value) || value < 0) {
            feedback.textContent = '❌ Nilai harus berupa angka positif';
            feedback.classList.add('show', 'invalid');
            feedback.classList.remove('valid');
        } else if (input.hasAttribute('max') && value > parseFloat(input.getAttribute('max'))) {
            feedback.textContent = `❌ Nilai maksimal ${input.getAttribute('max')}`;
            feedback.classList.add('show', 'invalid');
            feedback.classList.remove('valid');
        } else {
            feedback.textContent = '✅ Valid';
            feedback.classList.add('show', 'valid');
            feedback.classList.remove('invalid');
        }
    }

    updateProgress() {
        const filledInputs = Array.from(this.inputs).filter(input => input.value.trim() !== '');
        const progress = (filledInputs.length / this.inputs.length) * 100;
        this.progressFill.style.width = progress + '%';
    }

    fillFormData(data) {
        Object.keys(data).forEach(key => {
            const input = this.form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
                this.validateInput(input);
            }
        });
        this.updateProgress();
    }

    clearForm() {
        this.inputs.forEach(input => {
            input.value = '';
            const feedback = input.closest('.input-container').querySelector('.input-feedback');
            feedback.textContent = '';
            feedback.classList.remove('show', 'valid', 'invalid');
        });
        this.updateProgress();
        this.resultContainer.classList.remove('show');
        this.resultText.textContent = '';
        this.resultDetails.textContent = '';
    }

    async handlePrediction() {
        this.loading.classList.add('show');
        this.resultContainer.classList.remove('show');

        const formData = new FormData(this.form);

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.result) {
                this.resultText.textContent = `🔮 Hasil Prediksi: ${data.result}`;
                this.resultDetails.textContent = `Model telah memproses data dan menentukan bahwa hasilnya adalah ${data.result}.`;
                this.resultContainer.classList.add('show');
            } else if (data.error) {
                this.resultText.textContent = `❌ Terjadi kesalahan: ${data.error}`;
                this.resultContainer.classList.add('show');
            }
        } catch (err) {
            this.resultText.textContent = '❌ Gagal terhubung ke server.';
            this.resultContainer.classList.add('show');
        } finally {
            this.loading.classList.remove('show');
        }
    }


    showNotification(message) {
        alert(message); // Ganti dengan toast atau modal kalau mau lebih interaktif
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CancerPredictionForm();
});
