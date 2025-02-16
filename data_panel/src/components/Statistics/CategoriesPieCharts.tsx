import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as d3 from 'd3';
import axios from 'axios';
import './CategoriesPieCharts.css';

interface CategoryItem {
    quantity: number;
    menuItemTitle: string;
    total: number;
}

interface CategoryData {
    [category: string]: CategoryItem[];
}

interface CategorySummary {
    category: string;
    totalQuantity: number;
    totalAmount: number;
}

const CategoriesPieCharts: React.FC = () => {
    const { date } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<CategoryData | null>(null);
    const [filteredData ,setFilteredData] = useState<CategoryData | null>(null);
    const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
    const overviewQuantityRef = useRef<SVGSVGElement | null>(null);
    const overviewTotalRef = useRef<SVGSVGElement | null>(null);
    const categoryChartsRef = useRef<HTMLDivElement | null>(null);

    const handleDateChange = (days: number) => {
        if (!date) return;

        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + days);

        // Format date as YYYY-MM-DD
        const newDate = currentDate.toISOString().split('T')[0];
        navigate(`/statistics/category/${newDate}`);
    };

    const isToday = (dateString: string): boolean => {
        const today = new Date();
        const compareDate = new Date(dateString);
        return today.toISOString().split('T')[0] === dateString;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/statistic/category/date/${date}/branch-id/67a5734ed823f416daaa4b1b`
                );

                // Filter out categories with 1 or fewer items
                const filteredData: CategoryData = {};
                const filtered: string[] = [];

                Object.entries(response.data).forEach(([category, items]) => {
                    if ((items as CategoryItem[]).length <= 1) {
                        filtered.push(category);
                    } else {
                        filteredData[category] = items as CategoryItem[];
                    }
                });

                setFilteredCategories(filtered);
                setFilteredData(filteredData);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [date]);

    useEffect(() => {
        if (!data || !filteredData) return;

        // Clear previous charts
        d3.select(overviewQuantityRef.current).selectAll('*').remove();
        d3.select(overviewTotalRef.current).selectAll('*').remove();
        d3.select(categoryChartsRef.current).selectAll('*').remove();

        const width = 531;
        const height = 531;
        const radius = Math.min(width, height) / 3;

        // Create color scale
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Create color mappings for categories and items
        const categoryColorMap = new Map<string, string>();
        const itemColorMap = new Map<string, string>();

        // Assign colors to categories for overview charts
        Object.keys(data).forEach((category, i) => {
            categoryColorMap.set(category, colorScale(i.toString()));
        });

        // Assign colors to all unique menu items
        const allItems = new Set<string>();
        Object.values(data).forEach(items => {
            items.forEach(item => allItems.add(item.menuItemTitle));
        });
        Array.from(allItems).forEach((item, i) => {
            itemColorMap.set(item, colorScale(i.toString()));
        });

        // Prepare overview data
        const categorySummaries: CategorySummary[] = Object.entries(data).map(([category, items]) => ({
            category,
            totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
            totalAmount: items.reduce((sum, item) => sum + item.total, 0),
        }));

        // Initialize the SVG containers with centered groups
        const quantitySvg = d3.select(overviewQuantityRef.current)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const totalSvg = d3.select(overviewTotalRef.current)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Draw overview charts with category colors
        drawPieChart(
            quantitySvg.node()!,
            categorySummaries,
            'totalQuantity',
            'category',
            width,
            height,
            radius,
            d => categoryColorMap.get(d.category) || '#ccc',
            'Quantity Distribution by Category'
        );

        drawPieChart(
            totalSvg.node()!,
            categorySummaries,
            'totalAmount',
            'category',
            width,
            height,
            radius,
            d => categoryColorMap.get(d.category) || '#ccc',
            'Total Amount Distribution by Category'
        );

        // Draw individual category charts with item colors
        Object.entries(filteredData).forEach(([category, items]) => {
            const categoryContainer = d3.select(categoryChartsRef.current)
                .append('div')
                .attr('class', 'category-charts');

            categoryContainer.append('h3')
                .text(category);

            const quantitySvg = categoryContainer.append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2},${height / 2})`);

            const totalSvg = categoryContainer.append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2},${height / 2})`);

            drawPieChart(
                quantitySvg.node()!,
                items,
                'quantity',
                'menuItemTitle',
                width,
                height,
                radius,
                d => itemColorMap.get(d.menuItemTitle) || '#ccc',
                'Quantity Distribution'
            );

            drawPieChart(
                totalSvg.node()!,
                items,
                'total',
                'menuItemTitle',
                width,
                height,
                radius,
                d => itemColorMap.get(d.menuItemTitle) || '#ccc',
                'Amount Distribution'
            );
        });
    }, [filteredData]);

    const drawPieChart = (
        element: SVGElement,
        data: any[],
        valueKey: string,
        labelKey: string,
        width: number,
        height: number,
        radius: number,
        colorFn: (d: any) => string,
        title: string
    ) => {
        const svg = d3.select(element);

        // Sort data first so pie and legend use same order
        const sortedData = [...data].sort((a, b) => b[valueKey] - a[valueKey]);

        // Add title
        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', -height / 3 + 20)
            .text(title);

        const pie = d3.pie<any>()
            .value(d => d[valueKey])
            .sort((a, b) => b[valueKey] - a[valueKey]);

        const arc = d3.arc<any>()
            .innerRadius(0)
            .outerRadius(radius - 40);

        const arcs = svg.selectAll('arc')
            .data(pie(sortedData))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => colorFn(d.data));

        // Add labels
        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .text(d => {
                const percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(1);
                return `${percentage}%`;
            });

        // Add legend
        const legend = svg.selectAll('.legend')
            .data(sortedData)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(${radius + 2},${-radius + 20 + i * 20})`);

        legend.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', d => colorFn(d));

        legend.append('text')
            .attr('x', 15)
            .attr('y', 10)
            .text(d => `${d[labelKey]}: ${d[valueKey]}`);

        // Add total
        const total = sortedData.reduce((sum, item) => sum + item[valueKey], 0);
        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', radius + 20)
            .attr('class', 'total-label')
            .text(`Total: ${total}`);
    };

    if (!data || !filteredData) return <div>Loading...</div>;

    return (
        <div className="categories-pie-charts">
            <div className="date-navigation">
                <button
                    onClick={() => handleDateChange(-1)}
                    className="nav-button"
                >
                    ← Previous Day
                </button>
                <h2>Category Statistics for {date}</h2>
                <button
                    onClick={() => handleDateChange(1)}
                    className="nav-button"
                    disabled={isToday(date || '')}
                >
                    Next Day →
                </button>
            </div>

            <div className="overview-charts">
                <svg ref={overviewQuantityRef} width="531" height="531"></svg>
                <svg ref={overviewTotalRef} width="531" height="531"></svg>
            </div>

            <h2>Individual Category Statistics</h2>
            <div ref={categoryChartsRef} className="category-charts-container"></div>

            {filteredCategories.length > 0 && (
                <div className="filtered-categories">
                    <p>
                        Filtered out categories (≤ 1 item): {filteredCategories.join(', ')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CategoriesPieCharts; 