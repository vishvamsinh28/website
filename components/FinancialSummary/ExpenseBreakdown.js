import Container from '../layout/Container'
import Heading from "../typography/Heading"
import Paragraph from '../typography/Paragraph'


const cardsData = [
    {
        title: "Mentorship Program",
        body: "Our AsyncAPI Mentorship program offers paid guidance to develop valuable features, investing in tools and motivated individuals for community benefit.",
        image: "/img/finance/expense_1.png",
    },
    {
        title: "Bounty Program",
        body: "Rewarding contributors regardless of affiliation or volunteer status. Free mentoring and support for newcomers to build portfolios and unlock tech prospects.",
        image: "/img/finance/expense_2.png",
    },
    {
        title: "Events",
        body: "Supporting AsyncAPI conferences incurs costs for services and travel arrangements. Your contributions facilitate event hosting and community growth.",
        image: "/img/finance/expense_3.png",
    },
    {
        title: "Swag Store",
        body: "Creating a swag store for seamless distribution to contributors, mentees, ambassadors, and community members. Store profits can fund complimentary swag expenses.",
        image: "/img/finance/expense_4.png",
    },
    {
        title: "Hiring",
        body: "To support our community, we require full time commitment. Open Collective helps us hire for AsyncAPI. Thulie joins as community manager, with plans to expand the team. our team",
        image: "/img/finance/expense_5.png",
    },
    {
        title: "Services",
        body: "Occasionally, we must pay for services such as Zoom or Descript, as they are not available through specific Open Source support programs.",
        image: "/img/finance/expense_6.png",
    },
];

function Card({ title, body, image }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            {image && <img src={image} alt={title} className="w-full h-32 object-cover rounded-md mb-4" />}
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-gray-600">{body}</p>
        </div>
    );
}

function ExpenseBreakdown() {
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
    return (
        <Container wide>
            <div className="grid lg:grid-cols-9 lg:gap-8 lg:text-center my-16" style={{ backgroundColor: "#EFFAFE" }}>
                <div className="col-start-2 col-span-7 my-12">
                    <Heading level="h1" typeStyle="heading-md" className="my-3 mx-3"><h1 id="expense-breakdown">Expense Breakdown</h1></Heading>
                    <Paragraph typeStyle="body-md" className="my-3 max-w-4xl mx-3">
                        Funds from GitHub Sponsors are directly transferred to our AsyncAPI Open
                        Collective account. We maintain transparency in all expenses, and the TSC approves
                        anticipated expenses.
                    </Paragraph>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mx-3">
                        {cardsData.map((card, index) => (
                            <Card key={index} title={card.title} body={card.body} image={card.image} />
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ExpenseBreakdown