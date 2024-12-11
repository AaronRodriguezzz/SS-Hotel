
export default function normalDateForm(dateToFormat) {
    const format = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateToFormat).toLocaleDateString("en-US", format);
}   