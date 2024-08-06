const API_ROOT = import.meta.env.VITE_API_ROOT

const getKmutt = async () => {
    try {
        const res = await fetch(`${API_ROOT}`)
        const data = await res.json();
        return data;
    }catch (error) {
        throw new Error(error);
    }
}

export { getKmutt }