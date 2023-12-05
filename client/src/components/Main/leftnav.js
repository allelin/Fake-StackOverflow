export default function LeftNav(props) {
    return (
		<div className="left_bar">
			<nav className="nav_main">
				<div id="questions" 
				className={`${props.QClicked ? 'clicked' : ''}`} 
				onClick={props.handleQClicked}
				>Questions
				</div>
				<div id="tags" 
				className={`${props.TagClicked ? 'clicked' : ''}`} 
				onClick={props.handleTagClicked}
				>Tags
				</div>
			</nav>
		</div>
	);
}